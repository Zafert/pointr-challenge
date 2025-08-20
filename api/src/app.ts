import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Import routes
import siteRoutes from './routes/siteRoutes';
import buildingRoutes from './routes/buildingRoutes';
import levelRoutes from './routes/levelRoutes';

const app = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'Pointr Maps API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/sites', siteRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/levels', levelRoutes);

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong!'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Pointr Maps API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;
