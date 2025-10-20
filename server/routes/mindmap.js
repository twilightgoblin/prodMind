import express from 'express';
import fetch from 'node-fetch';
import MindMap from '../models/MindMap.js';

const router = express.Router();

// Generate mind map
router.post('/generate', async (req, res) => {
  try {
    const { topic, depth = 3, style = 'hierarchical' } = req.body;
    const userId = req.headers['x-user-id'] || 'default';

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    try {
      // Generate mind map using AI
      const mindMapData = await generateAIMindMap(topic, depth, style);
      
      res.json({
        success: true,
        data: mindMapData,
        metadata: {
          topic,
          depth,
          style,
          generatedAt: new Date().toISOString(),
          nodeCount: mindMapData.nodes?.length || 0
        }
      });
    } catch (error) {
      console.warn('AI generation failed, using fallback:', error.message);
      
      // Fallback to default structure
      const fallbackData = getDefaultMindMap(topic);
      res.json({
        success: true,
        data: fallbackData,
        metadata: {
          topic,
          depth,
          style,
          generatedAt: new Date().toISOString(),
          nodeCount: fallbackData.nodes?.length || 0,
          fallback: true
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save mind map
router.post('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default';
    const { name, topic, nodes, edges, style, depth } = req.body;

    if (!name || !topic || !nodes || !edges) {
      return res.status(400).json({ error: 'Name, topic, nodes, and edges are required' });
    }

    const mindMap = new MindMap({
      name,
      topic,
      nodes,
      edges,
      style,
      depth,
      metadata: {
        nodeCount: nodes.length,
        edgeCount: edges.length,
        generatedBy: 'manual'
      },
      userId
    });

    await mindMap.save();
    res.status(201).json(mindMap);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all mind maps
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, topic } = req.query;
    const userId = req.headers['x-user-id'] || 'default';

    const filter = { userId };
    if (topic) {
      filter.$or = [
        { topic: { $regex: topic, $options: 'i' } },
        { name: { $regex: topic, $options: 'i' } }
      ];
    }

    const mindMaps = await MindMap.find(filter)
      .select('-nodes -edges') // Exclude large fields for list view
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MindMap.countDocuments(filter);

    res.json({
      mindMaps,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get mind map by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default';
    const mindMap = await MindMap.findOne({ _id: req.params.id, userId });

    if (!mindMap) {
      return res.status(404).json({ error: 'Mind map not found' });
    }

    res.json(mindMap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update mind map
router.put('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default';
    const updates = req.body;

    // Update metadata if nodes/edges changed
    if (updates.nodes || updates.edges) {
      updates.metadata = {
        ...updates.metadata,
        nodeCount: updates.nodes?.length || 0,
        edgeCount: updates.edges?.length || 0
      };
    }

    const mindMap = await MindMap.findOneAndUpdate(
      { _id: req.params.id, userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!mindMap) {
      return res.status(404).json({ error: 'Mind map not found' });
    }

    res.json(mindMap);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete mind map
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default';
    const mindMap = await MindMap.findOneAndDelete({ _id: req.params.id, userId });

    if (!mindMap) {
      return res.status(404).json({ error: 'Mind map not found' });
    }

    res.json({ message: 'Mind map deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to generate AI mind map
async function generateAIMindMap(topic, depth, style) {
  const prompt = `Create a structured mind map for "${topic}" with ${depth} levels of depth in ${style} style. 

Return a JSON object with this exact structure:
{
  "nodes": [
    {"id": 0, "label": "Main Topic", "level": 0, "type": "root"},
    {"id": 1, "label": "Subtopic 1", "level": 1, "type": "main"},
    {"id": 2, "label": "Detail 1", "level": 2, "type": "sub"}
  ],
  "edges": [
    {"from": 0, "to": 1, "type": "hierarchy"},
    {"from": 1, "to": 2, "type": "hierarchy"}
  ]
}

Make it comprehensive and educational with practical subtopics.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error('OpenAI API request failed');
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  try {
    // Try to parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.warn('Failed to parse AI response, using fallback');
  }

  // Fallback to text parsing
  return createMindMapFromText(content, topic);
}

function createMindMapFromText(text, topic) {
  const lines = text.split('\n').filter(line => line.trim());
  const nodes = [{ id: 0, label: topic, level: 0, type: 'root' }];
  const edges = [];
  let nodeId = 1;

  lines.forEach((line) => {
    const level = (line.match(/^\s*/)[0].length / 2) || 0;
    const text = line.trim().replace(/^[-*]\s*/, '');
    
    if (text && level > 0 && level <= 3) {
      const node = {
        id: nodeId++,
        label: text,
        level,
        type: level === 1 ? 'main' : 'sub'
      };
      nodes.push(node);

      // Create edge to parent
      const parentNode = nodes.slice().reverse().find(n => n.level === level - 1);
      if (parentNode) {
        edges.push({
          from: parentNode.id,
          to: node.id,
          type: 'hierarchy'
        });
      }
    }
  });

  return { nodes, edges };
}

function getDefaultMindMap(topic) {
  return {
    nodes: [
      { id: 0, label: topic, level: 0, type: 'root' },
      { id: 1, label: 'Key Concepts', level: 1, type: 'main' },
      { id: 2, label: 'Applications', level: 1, type: 'main' },
      { id: 3, label: 'Related Topics', level: 1, type: 'main' },
      { id: 4, label: 'Fundamentals', level: 2, type: 'sub' },
      { id: 5, label: 'Advanced Topics', level: 2, type: 'sub' },
      { id: 6, label: 'Real-world Use', level: 2, type: 'sub' },
      { id: 7, label: 'Best Practices', level: 2, type: 'sub' }
    ],
    edges: [
      { from: 0, to: 1, type: 'hierarchy' },
      { from: 0, to: 2, type: 'hierarchy' },
      { from: 0, to: 3, type: 'hierarchy' },
      { from: 1, to: 4, type: 'hierarchy' },
      { from: 1, to: 5, type: 'hierarchy' },
      { from: 2, to: 6, type: 'hierarchy' },
      { from: 2, to: 7, type: 'hierarchy' }
    ]
  };
}

export default router;