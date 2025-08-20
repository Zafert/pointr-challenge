import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Site, CreateSiteRequest, ApiResponse } from '../types';

const router = express.Router();

// In-memory storage (replace with database in production)
let sites: Site[] = [];

// GET /api/sites - Get all sites
router.get('/', (req: Request, res: Response<ApiResponse<Site[]>>) => {
  try {
    res.status(200).json({
      success: true,
      data: sites,
      count: sites.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve sites'
    });
  }
});

// GET /api/sites/:id - Get site by ID
router.get('/:id', (req: Request, res: Response<ApiResponse<Site>>) => {
  try {
    const { id } = req.params;
    const site = sites.find(site => site.id === id);
    
    if (!site) {
      return res.status(404).json({
        success: false,
        error: 'Site not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: site
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve site'
    });
  }
});

// POST /api/sites - Create new site
router.post('/', (req: Request<{}, {}, CreateSiteRequest>, res: Response<ApiResponse<Site>>) => {
  try {
    const { name, description, location, coordinates } = req.body;
    
    // Validation
    if (!name || !location) {
      return res.status(400).json({
        success: false,
        error: 'Name and location are required'
      });
    }
    
    const newSite: Site = {
      id: uuidv4(),
      name,
      description: description || '',
      location,
      coordinates: coordinates || null,
      buildings: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    sites.push(newSite);
    
    res.status(201).json({
      success: true,
      message: 'Site created successfully',
      data: newSite
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create site'
    });
  }
});

// DELETE /api/sites/:id - Delete site
router.delete('/:id', (req: Request, res: Response<ApiResponse<Site>>) => {
  try {
    const { id } = req.params;
    const siteIndex = sites.findIndex(site => site.id === id);
    
    if (siteIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Site not found'
      });
    }
    
    const deletedSite = sites.splice(siteIndex, 1)[0];
    
    res.status(200).json({
      success: true,
      message: 'Site deleted successfully',
      data: deletedSite
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete site'
    });
  }
});

export default router;
