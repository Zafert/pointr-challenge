import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Building, CreateBuildingRequest, ApiResponse } from '../types';

const router = express.Router();

// In-memory storage (replace with database in production)
let buildings: Building[] = [];

// GET /api/buildings - Get all buildings
router.get('/', (req: Request, res: Response<ApiResponse<Building[]>>) => {
  try {
    const { siteId } = req.query;
    
    let filteredBuildings = buildings;
    if (siteId && typeof siteId === 'string') {
      filteredBuildings = buildings.filter(building => building.siteId === siteId);
    }
    
    res.status(200).json({
      success: true,
      data: filteredBuildings,
      count: filteredBuildings.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve buildings'
    });
  }
});

// GET /api/buildings/:id - Get building by ID
router.get('/:id', (req: Request, res: Response<ApiResponse<Building>>) => {
  try {
    const { id } = req.params;
    const building = buildings.find(building => building.id === id);
    
    if (!building) {
      return res.status(404).json({
        success: false,
        error: 'Building not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: building
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve building'
    });
  }
});

// POST /api/buildings - Create new building
router.post('/', (req: Request<{}, {}, CreateBuildingRequest>, res: Response<ApiResponse<Building>>) => {
  try {
    const { name, description, siteId, address, coordinates, floors } = req.body;
    
    // Validation
    if (!name || !siteId) {
      return res.status(400).json({
        success: false,
        error: 'Name and siteId are required'
      });
    }
    
    const newBuilding: Building = {
      id: uuidv4(),
      name,
      description: description || '',
      siteId,
      address: address || '',
      coordinates: coordinates || null,
      floors: floors || 1,
      levels: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    buildings.push(newBuilding);
    
    res.status(201).json({
      success: true,
      message: 'Building created successfully',
      data: newBuilding
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create building'
    });
  }
});

// DELETE /api/buildings/:id - Delete building
router.delete('/:id', (req: Request, res: Response<ApiResponse<Building>>) => {
  try {
    const { id } = req.params;
    const buildingIndex = buildings.findIndex(building => building.id === id);
    
    if (buildingIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Building not found'
      });
    }
    
    const deletedBuilding = buildings.splice(buildingIndex, 1)[0];
    
    res.status(200).json({
      success: true,
      message: 'Building deleted successfully',
      data: deletedBuilding
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete building'
    });
  }
});

export default router;
