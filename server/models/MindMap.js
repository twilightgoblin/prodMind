import mongoose from 'mongoose';

const nodeSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  label: { type: String, required: true },
  level: { type: Number, default: 0 },
  type: { 
    type: String, 
    enum: ['root', 'main', 'sub', 'leaf'],
    default: 'main'
  },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 }
  },
  color: { type: String, default: '#3b82f6' },
  size: { type: Number, default: 20 }
});

const edgeSchema = new mongoose.Schema({
  from: { type: Number, required: true },
  to: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ['hierarchy', 'association', 'dependency'],
    default: 'hierarchy'
  },
  weight: { type: Number, default: 1 }
});

const mindMapSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  nodes: [nodeSchema],
  edges: [edgeSchema],
  style: {
    type: String,
    enum: ['hierarchical', 'radial', 'network', 'tree'],
    default: 'hierarchical'
  },
  depth: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  metadata: {
    nodeCount: { type: Number, default: 0 },
    edgeCount: { type: Number, default: 0 },
    generatedBy: { 
      type: String, 
      enum: ['ai', 'manual', 'template'],
      default: 'ai'
    }
  },
  userId: {
    type: String,
    default: 'default'
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
mindMapSchema.index({ userId: 1, createdAt: -1 });
mindMapSchema.index({ topic: 'text', name: 'text' });
mindMapSchema.index({ isPublic: 1 });

export default mongoose.model('MindMap', mindMapSchema);