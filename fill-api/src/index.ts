import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import formRoutes from './routes/formRoutes';
import devRoutes from './routes/devRoute';
import {errorHandler} from './middlewares/errorMiddleware';
import morgan from 'morgan';

// Import individual middleware
import healthCheckRoute from './routes/healthCheckRoute';
import { globalLimiter, apiLimiter, stores } from './middlewares/rateLimitMiddleware';
import { helmetMiddleware, cspMiddleware } from './middlewares/helmetMiddleware';


// Load environment variables from .env file
dotenv.config();

const app = express();
// const PORT = Number(process.env.PORT || 8899);
const PORT = parseInt(process.env.PORT || '8899', 10);

// Store the rate limit stores in app.locals for access in other files
app.locals.globalLimiterStore = stores.globalStore;
app.locals.apiLimiterStore = stores.apiStore;

// For proxy
app.set('trust proxy', true);

// Apply security middleware individually
// 1. Helmet security headers
app.use(helmetMiddleware);
app.use(cspMiddleware);

// Rate limiting
app.use(globalLimiter);
app.use('/submissions', apiLimiter);

// CORS configuration
// app.use(cors());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json({limit:'100kb'}));
app.use(express.urlencoded({extended: true, limit: '100kb'}))

// Use morgan for logging HTTP requests
app.use(morgan('dev'));

// Routes
app.use('/', formRoutes);

// Special dev route to reset rate limits (development only!)
app.use('/dev', devRoutes);

// Health check route
app.use('/health', healthCheckRoute);

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});