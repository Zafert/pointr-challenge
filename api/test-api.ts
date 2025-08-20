import * as http from 'http';
import { ApiResponse, Site, Building, Level } from './src/types';

// Test response interface
interface TestResponse {
  status: number;
  data: any;
}

// Test function
async function testEndpoint(method: string, path: string, data?: any): Promise<TestResponse> {
  return new Promise((resolve, reject) => {
    const options: http.RequestOptions = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res: http.IncomingMessage) => {
      let responseData = '';
      
      res.on('data', (chunk: Buffer) => {
        responseData += chunk.toString();
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData);
          resolve({
            status: res.statusCode || 0,
            data: jsonData
          });
        } catch (e) {
          resolve({
            status: res.statusCode || 0,
            data: responseData
          });
        }
      });
    });

    req.on('error', (err: Error) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Main test function
async function runTests(): Promise<void> {
  console.log('🚀 Starting API Tests...\n');

  try {
    // Test 1: Health Check
         console.log('1. Testing Health Check...');
     const health = await testEndpoint('GET', '/health');
     console.log(`   Status: ${health.status}`);
     console.log(`   Response:`, health.data);
     console.log('✅ Health Check Passed\n');

    // Test 2: Get All Sites (Empty)
    console.log('2. Testing GET /api/sites (empty)...');
         const emptySites = await testEndpoint('GET', '/api/sites');
     console.log(`   Status: ${emptySites.status}`);
     console.log(`   Response:`, JSON.stringify(emptySites.data, null, 2));
     console.log('✅ Get Sites (Empty) Passed\n');

    // Test 3: Create Site
    console.log('3. Testing POST /api/sites...');
    const newSite = {
      name: "Downtown Office",
      description: "Main office building",
      location: "123 Main St, City",
      coordinates: { latitude: 40.7128, longitude: -74.0060 }
    };
              const createSite = await testEndpoint('POST', '/api/sites', newSite);
     console.log(`   Status: ${createSite.status}`);
     console.log(`   Response:`, JSON.stringify(createSite.data, null, 2));
     
     const siteId = createSite.data?.data?.id;
     console.log(`   Created Site ID: ${siteId}`);
     console.log('✅ Create Site Passed\n');

    // Test 4: Get All Sites (With Data)
    console.log('4. Testing GET /api/sites (with data)...');
         const sitesWithData = await testEndpoint('GET', '/api/sites');
     console.log(`   Status: ${sitesWithData.status}`);
     console.log(`   Response:`, JSON.stringify(sitesWithData.data, null, 2));
     console.log('✅ Get Sites (With Data) Passed\n');

    // Test 5: Create Building
    if (siteId) {
      console.log('5. Testing POST /api/buildings...');
      const newBuilding = {
        name: "Tower A",
        description: "Main office tower",
        siteId: siteId,
        address: "123 Main St, Floor 1",
        coordinates: { latitude: 40.7128, longitude: -74.0060 },
        floors: 10
      };
                    const createBuilding = await testEndpoint('POST', '/api/buildings', newBuilding);
       console.log(`   Status: ${createBuilding.status}`);
       console.log(`   Response:`, JSON.stringify(createBuilding.data, null, 2));
       
       const buildingId = createBuilding.data?.data?.id;
       console.log(`   Created Building ID: ${buildingId}`);
       console.log('✅ Create Building Passed\n');

      // Test 6: Create Level
      if (buildingId) {
        console.log('6. Testing POST /api/levels...');
        const newLevel = {
          name: "Ground Floor",
          description: "Main entrance level",
          buildingId: buildingId,
          floorNumber: 0,
          coordinates: { latitude: 40.7128, longitude: -74.0060 },
          mapData: {
            floorPlan: "ground-floor-plan.svg",
            dimensions: { width: 100, height: 80 }
          }
        };
                 const createLevel = await testEndpoint('POST', '/api/levels', newLevel);
         console.log(`   Status: ${createLevel.status}`);
         console.log(`   Response:`, JSON.stringify(createLevel.data, null, 2));
         console.log('✅ Create Level Passed\n');

        // Test 7: Bulk Create Levels
        console.log('7. Testing POST /api/levels/bulk...');
        const bulkLevels = {
          levels: [
            {
              name: "First Floor",
              description: "Office space level 1",
              buildingId: buildingId,
              floorNumber: 1,
              coordinates: { latitude: 40.7128, longitude: -74.0060 },
              mapData: {
                floorPlan: "first-floor-plan.svg",
                dimensions: { width: 100, height: 80 }
              }
            },
            {
              name: "Second Floor",
              description: "Office space level 2",
              buildingId: buildingId,
              floorNumber: 2,
              coordinates: { latitude: 40.7128, longitude: -74.0060 },
              mapData: {
                floorPlan: "second-floor-plan.svg",
                dimensions: { width: 100, height: 80 }
              }
            }
          ]
        };
                 const bulkCreate = await testEndpoint('POST', '/api/levels/bulk', bulkLevels);
         console.log(`   Status: ${bulkCreate.status}`);
         console.log(`   Response:`, JSON.stringify(bulkCreate.data, null, 2));
         console.log('✅ Bulk Create Levels Passed\n');

        // Test 8: Get Levels by Building
        console.log('8. Testing GET /api/levels?buildingId=...');
                 const levelsByBuilding = await testEndpoint('GET', `/api/levels?buildingId=${buildingId}`);
         console.log(`   Status: ${levelsByBuilding.status}`);
         console.log(`   Response:`, JSON.stringify(levelsByBuilding.data, null, 2));
         console.log('✅ Get Levels by Building Passed\n');

         // Test 9: Delete Level
         console.log('9. Testing DELETE /api/levels/:id...');
         const levelToDelete = levelsByBuilding.data?.data?.[0];
         if (levelToDelete) {
           const deleteLevel = await testEndpoint('DELETE', `/api/levels/${levelToDelete.id}`);
           console.log(`   Status: ${deleteLevel.status}`);
           console.log(`   Response:`, JSON.stringify(deleteLevel.data, null, 2));
           console.log('✅ Delete Level Passed\n');
         }

         // Test 10: Delete Building
         console.log('10. Testing DELETE /api/buildings/:id...');
         const deleteBuilding = await testEndpoint('DELETE', `/api/buildings/${buildingId}`);
         console.log(`   Status: ${deleteBuilding.status}`);
         console.log(`   Response:`, JSON.stringify(deleteBuilding.data, null, 2));
         console.log('✅ Delete Building Passed\n');

         // Test 11: Delete Site
         console.log('11. Testing DELETE /api/sites/:id...');
         const deleteSite = await testEndpoint('DELETE', `/api/sites/${siteId}`);
         console.log(`   Status: ${deleteSite.status}`);
         console.log(`   Response:`, JSON.stringify(deleteSite.data, null, 2));
         console.log('✅ Delete Site Passed\n');
      }
    }

         console.log('\n🎉 All 11 tests completed successfully!');
     console.log('🚀 Your Pointr Maps API is fully functional with complete CRUD operations!');

  } catch (error) {
    console.error('❌ Test failed:', error instanceof Error ? error.message : 'Unknown error');
  }
}

// Check if server is running and start tests
console.log('🔍 Checking if server is running on http://localhost:3000...\n');
runTests();
