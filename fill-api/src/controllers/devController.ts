import { Request, Response } from "express";
import { MemoryStore } from "express-rate-limit";

export const resetRateLimit = (req: Request, res: Response) => {
    if (process.env.NODE_ENV !== 'development') {
        res.status(403).json({
            status: 'error',
            message: 'This endpoint is only available in development mode'
        });
        return;
    }

    try {
        // In express-rate-limit v6+, need to access the store directly
        // Get the IP from query param that pass from url?key:value
        const queryIP = req.query.ip as string;

        // Get the IP to reset
        const ip = queryIP || req.ip || req.headers['x-forwarded-for'] as string || 'unknown';

        // Reset the rate limit by accessing the req.app.locals
        const globalLimiterStore = req.app.locals.globalLimiterStore as MemoryStore;
        const apiLimiterStore = req.app.locals.apiLimiterStore as MemoryStore;

        // Reset limits if stores exist
        if (globalLimiterStore) {
            globalLimiterStore.resetKey(ip);
            console.log(`Reset global rate limit for IP: ${ip}`);
        }
        if (apiLimiterStore) {
            apiLimiterStore.resetKey(ip);
            console.log(`Reset API rate limit for IP: ${ip}`);
        }

        res.status(200).json({
            status: 'success',
            message: 'Rate limits reset successfully',
            ip: ip
        });
        return;

    } catch (error) {
        console.error('Error resetting rate limits:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to reset rate limits',
            error: (error as Error).message
        });
        return;
    }
};