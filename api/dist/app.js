"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
// Import routes
const siteRoutes_1 = __importDefault(require("./routes/siteRoutes"));
const buildingRoutes_1 = __importDefault(require("./routes/buildingRoutes"));
const levelRoutes_1 = __importDefault(require("./routes/levelRoutes"));
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '3000', 10);
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Pointr Maps API is running',
        timestamp: new Date().toISOString()
    });
});
// API routes
app.use('/api/sites', siteRoutes_1.default);
app.use('/api/buildings', buildingRoutes_1.default);
app.use('/api/levels', levelRoutes_1.default);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`
    });
});
// Error handler
app.use((err, req, res, next) => {
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
exports.default = app;
