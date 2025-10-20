// Simple test script to verify API key endpoints
// Run with: node test-api-keys.js

const API_BASE = 'http://localhost:5001/api';

async function testApiKeyEndpoints() {
  console.log('🧪 Testing API Key Endpoints...\n');

  try {
    // Test 1: Get all services status
    console.log('1️⃣ Testing GET /api/keys (all services)');
    const allServicesResponse = await fetch(`${API_BASE}/keys`);
    
    if (allServicesResponse.ok) {
      const data = await allServicesResponse.json();
      console.log('✅ Success:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ Failed:', allServicesResponse.status, await allServicesResponse.text());
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Get YouTube API key
    console.log('2️⃣ Testing GET /api/keys/youtube');
    const youtubeResponse = await fetch(`${API_BASE}/keys/youtube`);
    
    if (youtubeResponse.ok) {
      const data = await youtubeResponse.json();
      console.log('✅ Success:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ Failed:', youtubeResponse.status, await youtubeResponse.text());
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Test invalid service
    console.log('3️⃣ Testing GET /api/keys/invalid (should fail)');
    const invalidResponse = await fetch(`${API_BASE}/keys/invalid`);
    
    if (!invalidResponse.ok) {
      const data = await invalidResponse.json();
      console.log('✅ Expected failure:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ Unexpected success for invalid service');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\n💡 Make sure your server is running on http://localhost:5001');
  }
}

// Run the tests
testApiKeyEndpoints();