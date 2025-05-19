import rateLimit, {MemoryStore} from 'express-rate-limit';
import { Request, Response } from 'express';

// Custom handler for rate limit exceeded
const rateLimitHandler = (req: Request, res: Response): void => {
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    console.log(`[RATE LIMIT] IP: ${ip} blocked at ${new Date().toISOString()} on path ${req.path}`);
    res.status(429).json({
        status: 'error',
        message: 'Too many requests from this IP, please try again later.'
    });
};

// Create a store instance that we can access later
const globalStore = new MemoryStore();
const apiStore = new MemoryStore();

// Global Rate Limiter
export const globalLimiter = rateLimit({
    windowMs: 10*60*1000, // 10 minutes
    max: 500, // limit each IP to 500 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: rateLimitHandler,
    store: globalStore,
    // store for testing purposes - enables reset via API
    // Note: Use Redis or another persistent store in production
    keyGenerator: (req) => req.ip || req.headers['x-forwarded-for'] as string || 'unknown'
    // message: 'Too many requests from this IP, please try again after 15 minutes'
});

// API-specific rate limiter (stricter)
export const apiLimiter = rateLimit({
    windowMs: 5*60*1000, // 5 minutes
    max: 20, // limit each IP to 20 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler,
    // Store for testing purposes - enable reset via API
    store: apiStore,
    keyGenerator: (req) => req.ip || req.headers['x-forwarded-for'] as string || 'unknown'
    // message: 'Too many API request from this IP, please try again after 5 minutes'
});

// Export stores so they can be accessed for testing/development
export const stores = {
    globalStore,
    apiStore
};