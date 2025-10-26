import { useState, useEffect } from 'react';
import { Key, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { apiKeyService } from '../services/apiKeyService.js';

const ApiKeyStatus = () => {
  const [services, setServices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServicesStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const status = await apiKeyService.getServicesStatus();
      setServices(status);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch services status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicesStatus();
  }, []);

  const testApiKey = async (service) => {
    try {
      const apiKey = await apiKeyService.getApiKey(service);
      alert(`✅ API Key retrieved for ${service}: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`);
    } catch (err) {
      alert(`❌ Failed to get API key for ${service}: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Key className="text-blue-400" size={20} />
          <h3 className="text-lg font-semibold text-white">API Key Status</h3>
        </div>
        <p className="text-gray-400">Loading API key status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Key className="text-red-400" size={20} />
          <h3 className="text-lg font-semibold text-white">API Key Status</h3>
        </div>
        <p className="text-red-400 mb-4">Error: {error}</p>
        <button
          onClick={fetchServicesStatus}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Key className="text-blue-400" size={20} />
          <h3 className="text-lg font-semibold text-white">API Key Status</h3>
        </div>
        <button
          onClick={fetchServicesStatus}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
          title="Refresh status"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {Object.entries(services).map(([service, status]) => (
          <div key={service} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              {status.configured ? (
                <CheckCircle className="text-green-400" size={16} />
              ) : (
                <XCircle className="text-red-400" size={16} />
              )}
              <div>
                <span className="text-white font-medium capitalize">{service}</span>
                {status.masked && (
                  <p className="text-xs text-gray-400">{status.masked}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                status.configured 
                  ? 'bg-green-900/30 text-green-300' 
                  : 'bg-red-900/30 text-red-300'
              }`}>
                {status.configured ? 'Configured' : 'Missing'}
              </span>
              
              {status.configured && (
                <button
                  onClick={() => testApiKey(service)}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Test
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg">
        <p className="text-sm text-blue-300">
          💡 API keys are now retrieved dynamically from the backend when needed. 
          Click "Test" to verify a service can fetch its API key successfully.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyStatus;