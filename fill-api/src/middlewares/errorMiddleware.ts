import {Request, Response, NextFunction} from 'express';
import {ZodError} from 'zod';

export const errorHandler = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    // Handle Zod validation error
    if (err instanceof ZodError) {
            console.error('Zod validation error:', err.errors);
            res.status(400).json({
            error: 'Validation error',
            details: err.errors
        });
        return;
    }

    // Handle known errors
    if (err instanceof Error) {
        console.error('Error:', err);
        res.status(500).json({Error: err});
        return;
    }

    // Handle unknown errors
    console.error('Unknown error:', err);
    res.status(500).json({Error: 'Unknown internal server error'});
    return;
};