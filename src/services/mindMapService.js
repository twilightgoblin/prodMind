// MindMap Service - Knowledge graph visualization
class MindMapService {
  constructor() {
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.baseUrl = 'https://api.openai.com/v1';
    
    // Debug: Check if API key is loaded
    console.log('MindMap - OpenAI API Key loaded:', this.openaiApiKey ? 'Yes' : 'No');
    console.log('MindMap - API Key value:', this.openaiApiKey ? 'sk-...' + this.openaiApiKey.slice(-10) : 'undefined');
  }

  async generateMindMap(topic, depth = 3, style = 'hierarchical') {
    try {
      // Check if API key is available
      if (!this.openaiApiKey || this.openaiApiKey.includes('your_openai_api_key')) {
        throw new Error('OpenAI API key not configured - cannot generate mind map');
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{
            role: 'system',
            content: `You are a knowledge graph generator. Create a structured mind map for the given topic with ${depth} levels of depth. Return the response as a JSON object with nodes and edges suitable for visualization.`
          }, {
            role: 'user',
            content: `Generate a ${style} mind map for: ${topic}`
          }],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const mindMapData = this.parseMindMapResponse(data.choices[0].message.content);
      
      return {
        success: true,
        data: mindMapData,
        metadata: {
          topic,
          depth,
          style,
          generatedAt: new Date().toISOString(),
          nodeCount: mindMapData.nodes?.length || 0
        }
      };
    } catch (error) {
      console.error('MindMap generation error:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  parseMindMapResponse(content) {
    try {
      // Try to parse JSON response
      const parsed = JSON.parse(content);
      return parsed;
    } catch {
      // Fallback: create structure from text
      return this.createMindMapFromText(content);
    }
  }

  createMindMapFromText(text) {
    const lines = text.split('\n').filter(line => line.trim());
    const nodes = [];
    const edges = [];
    let nodeId = 0;

    lines.forEach((line, index) => {
      const level = (line.match(/^\s*/)[0].length / 2) || 0;
      const text = line.trim().replace(/^[-*]\s*/, '');
      
      if (text) {
        const node = {
          id: nodeId++,
          label: text,
          level,
          type: level === 0 ? 'root' : level === 1 ? 'main' : 'sub'
        };
        nodes.push(node);

        // Create edge to parent
        if (level > 0) {
          const parentNode = nodes.slice().reverse().find(n => n.level === level - 1);
          if (parentNode) {
            edges.push({
              from: parentNode.id,
              to: node.id,
              type: 'hierarchy'
            });
          }
        }
      }
    });

    return { nodes, edges };
  }

  getDefaultMindMap(topic) {
    return {
      nodes: [
        { id: 0, label: topic, level: 0, type: 'root' },
        { id: 1, label: 'Key Concepts', level: 1, type: 'main' },
        { id: 2, label: 'Applications', level: 1, type: 'main' },
        { id: 3, label: 'Related Topics', level: 1, type: 'main' }
      ],
      edges: [
        { from: 0, to: 1, type: 'hierarchy' },
        { from: 0, to: 2, type: 'hierarchy' },
        { from: 0, to: 3, type: 'hierarchy' }
      ]
    };
  }



  async saveMindMap(mindMapData, name) {
    try {
      const savedMaps = this.getSavedMindMaps();
      const newMap = {
        id: Date.now(),
        name,
        data: mindMapData,
        createdAt: new Date().toISOString()
      };
      
      savedMaps.push(newMap);
      localStorage.setItem('prodmind_mindmaps', JSON.stringify(savedMaps));
      
      return { success: true, id: newMap.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getSavedMindMaps() {
    try {
      const saved = localStorage.getItem('prodmind_mindmaps');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  deleteMindMap(id) {
    try {
      const savedMaps = this.getSavedMindMaps();
      const filtered = savedMaps.filter(map => map.id !== id);
      localStorage.setItem('prodmind_mindmaps', JSON.stringify(filtered));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new MindMapService();