import React, { useState, useEffect } from 'react';
import { useMindMap } from '../hooks/useMindMap';
import { 
  Brain, 
  Plus, 
  Save, 
  Download, 
  Trash2, 
  Settings, 
  Loader2,
  AlertCircle,
  Eye,
  Share2
} from 'lucide-react';

const MindMapDashboard = () => {
  const {
    mindMapData,
    isGenerating,
    error,
    savedMaps,
    generateMindMap,
    saveMindMap,
    loadSavedMaps,
    loadMindMap,
    deleteMindMap,
    clearError,
    resetMindMap
  } = useMindMap();

  const [topic, setTopic] = useState('');
  const [depth, setDepth] = useState(3);
  const [style, setStyle] = useState('hierarchical');
  const [saveName, setSaveName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    loadSavedMaps();
  }, [loadSavedMaps]);

  const handleGenerate = async () => {
    await generateMindMap(topic, { depth, style });
  };

  const handleSave = async () => {
    const success = await saveMindMap(saveName);
    if (success) {
      setSaveName('');
      setShowSaveDialog(false);
    }
  };

  const handleLoad = (map) => {
    loadMindMap(map.data);
    setTopic(map.data.metadata?.topic || 'Loaded Mind Map');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this mind map?')) {
      await deleteMindMap(id);
    }
  };

  const exportMindMap = () => {
    if (!mindMapData) return;
    
    const dataStr = JSON.stringify(mindMapData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mindmap-${topic.replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#060010] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-12 w-12 text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">Mind Map Generator</h1>
          </div>
          <p className="text-xl text-gray-300">
            Visualize knowledge with AI-powered mind maps
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-800 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-300">{error}</span>
            <button
              onClick={clearError}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Control Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
                <Settings className="h-5 w-5 mr-2 text-blue-400" />
                Generate Mind Map
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Topic
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic to explore..."
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Depth Level: {depth}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="5"
                    value={depth}
                    onChange={(e) => setDepth(parseInt(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Style
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="hierarchical">Hierarchical</option>
                    <option value="radial">Radial</option>
                    <option value="network">Network</option>
                    <option value="timeline">Timeline</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!topic.trim() || isGenerating}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Generate Mind Map
                    </>
                  )}
                </button>
              </div>

              {/* Actions */}
              {mindMapData && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h3 className="text-lg font-medium mb-3 text-white">Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowSaveDialog(true)}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Mind Map
                    </button>
                    <button
                      onClick={exportMindMap}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export JSON
                    </button>
                    <button
                      onClick={resetMindMap}
                      className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center justify-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Saved Mind Maps */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Saved Mind Maps</h2>
              {savedMaps.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No saved mind maps yet</p>
              ) : (
                <div className="space-y-2">
                  {savedMaps.map((map) => (
                    <div key={map.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{map.name}</h4>
                        <p className="text-sm text-gray-400">
                          {new Date(map.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleLoad(map)}
                          className="p-1 text-blue-400 hover:text-blue-300"
                          title="Load"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(map.id)}
                          className="p-1 text-red-400 hover:text-red-300"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mind Map Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 h-[800px]">
              <h2 className="text-xl font-semibold mb-4 text-white">Mind Map Visualization</h2>
              {mindMapData ? (
                <MindMapVisualization data={mindMapData} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Generate a mind map to see visualization</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4 text-white">Save Mind Map</h3>
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Enter a name for your mind map..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 mb-4"
                autoFocus
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="px-4 py-2 text-gray-400 hover:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!saveName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple Mind Map Visualization Component
const MindMapVisualization = ({ data }) => {
  if (!data || !data.nodes) {
    return <div className="text-center text-gray-400">No data to visualize</div>;
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4 text-white">Mind Map Structure</h3>
        <div className="space-y-2">
          {data.nodes.map((node) => (
            <div
              key={node.id}
              className={`p-3 rounded-lg border-l-4 ${
                node.type === 'root' 
                  ? 'bg-blue-900/30 border-blue-400 text-blue-100' 
                  : node.type === 'main'
                  ? 'bg-purple-900/30 border-purple-400 text-purple-100 ml-4'
                  : 'bg-gray-800/50 border-gray-500 text-gray-300 ml-8'
              }`}
            >
              <div className="font-medium">{node.label}</div>
              <div className="text-sm opacity-75">Level {node.level}</div>
            </div>
          ))}
        </div>
        
        {data.nodes.length > 0 && (
          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
            <h4 className="font-medium mb-2 text-white">Statistics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
              <div>Total Nodes: {data.nodes.length}</div>
              <div>Total Edges: {data.edges?.length || 0}</div>
              <div>Root Nodes: {data.nodes.filter(n => n.type === 'root').length}</div>
              <div>Main Branches: {data.nodes.filter(n => n.type === 'main').length}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MindMapDashboard;