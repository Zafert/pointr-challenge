import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Level, CreateLevelRequest, BulkLevelRequest, ApiResponse, BulkResponse, BulkErrorResponse } from '../types';

const router = express.Router();

// In-memory storage (replace with database in production)
let levels: Level[] = [];

// GET /api/levels - Get all levels
router.get('/', (req: Request, res: Response<ApiResponse<Level[]>>) => {
  try {
    const { buildingId } = req.query;
    
    let filteredLevels = levels;
    if (buildingId && typeof buildingId === 'string') {
      filteredLevels = levels.filter(level => level.buildingId === buildingId);
    }
    
    res.status(200).json({
      success: true,
      data: filteredLevels,
      count: filteredLevels.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve levels'
    });
  }
});

// GET /api/levels/:id - Get level by ID
router.get('/:id', (req: Request, res: Response<ApiResponse<Level>>) => {
  try {
    const { id } = req.params;
    const level = levels.find(level => level.id === id);
    
    if (!level) {
      return res.status(404).json({
        success: false,
        error: 'Level not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: level
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve level'
    });
  }
});

// POST /api/levels - Import single level
router.post('/', (req: Request<{}, {}, CreateLevelRequest>, res: Response<ApiResponse<Level>>) => {
  try {
    const { name, description, buildingId, floorNumber, mapData, coordinates } = req.body;
    
    // Validation
    if (!name || !buildingId || floorNumber === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Name, buildingId, and floorNumber are required'
      });
    }
    
    const newLevel: Level = {
      id: uuidv4(),
      name,
      description: description || '',
      buildingId,
      floorNumber,
      mapData: mapData || null,
      coordinates: coordinates || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    levels.push(newLevel);
    
    res.status(201).json({
      success: true,
      message: 'Level imported successfully',
      data: newLevel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to import level'
    });
  }
});

// POST /api/levels/bulk - Import multiple levels
router.post('/bulk', (req: Request<{}, {}, BulkLevelRequest>, res: Response<BulkResponse | BulkErrorResponse>) => {
  try {
    const { levels: levelsData } = req.body;
    
    if (!Array.isArray(levelsData) || levelsData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Levels array is required and must not be empty',
        errors: [],
        importedCount: 0,
        totalCount: 0
      });
    }
    
    const importedLevels: Level[] = [];
    const errors: string[] = [];
    
    levelsData.forEach((levelData, index) => {
      try {
        const { name, description, buildingId, floorNumber, mapData, coordinates } = levelData;
        
        if (!name || !buildingId || floorNumber === undefined) {
          errors.push(`Level ${index + 1}: Missing required fields (name, buildingId, floorNumber)`);
          return;
        }
        
        const newLevel: Level = {
          id: uuidv4(),
          name,
          description: description || '',
          buildingId,
          floorNumber,
          mapData: mapData || null,
          coordinates: coordinates || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        levels.push(newLevel);
        importedLevels.push(newLevel);
      } catch (error) {
        errors.push(`Level ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Some levels failed to import',
        errors,
        importedCount: importedLevels.length,
        totalCount: levelsData.length
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'All levels imported successfully',
      data: importedLevels,
      count: importedLevels.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to import levels',
      errors: [],
      importedCount: 0,
      totalCount: 0
    });
  }
});

// DELETE /api/levels/:id - Delete level
router.delete('/:id', (req: Request, res: Response<ApiResponse<Level>>) => {
  try {
    const { id } = req.params;
    const levelIndex = levels.findIndex(level => level.id === id);
    
    if (levelIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Level not found'
      });
    }
    
    const deletedLevel = levels.splice(levelIndex, 1)[0];
    
    res.status(200).json({
      success: true,
      message: 'Level deleted successfully',
      data: deletedLevel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete level'
    });
  }
});

export default router;
