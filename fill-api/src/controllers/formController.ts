import {Request, Response, NextFunction} from 'express';
import prisma from '../config/db';
import {formSubmissionSchema, FormSubmissionInput, partialFormSubmissionSchema, PartialFormSubmissionInput} from '../validators/formValidator';

//post form
export const createFormSubmission = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //Validate input
        const validatedData: FormSubmissionInput = formSubmissionSchema.parse(req.body);

        //Create form to database
        const submission = await prisma.formSubmission.create({
            data: validatedData
        });
        
        console.log('Form submission created:', submission);

        res.status(201).json(submission);
    } catch (error) {
        // if (error instanceof Error) {
        //     res.status(400).json({error: error.message});
        // } else {
        //     res.status(500).json({error: 'Internal server error'});
        // }
        next(error);
    }
};

// list all forms
export const listFormSubmissions = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const submissions = await prisma.formSubmission.findMany({
            orderBy: {createdAt: 'desc'}
        });

        console.log('Fetched form submissions all:', submissions);

        res.json(submissions);
    } catch (error) {
        next(error);
    }
};

// get form by id
export const getFormSubmission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {id} = req.params;
        const submission = await prisma.formSubmission.findUnique({
            where: {id: Number(id)}
        });

        if (!submission) {
            res.status(404).json({error: 'Form not found'});
            return;
        }

        console.log('Fetched form submission by id:', submission);

        res.json(submission);
    } catch (error) {
        next(error);
    }
};

// delete form by id
export const deleteFormSubmission = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const submission = await prisma.formSubmission.delete({
            where: {id: Number(id)}
        });

        console.log('Form submission deleted:', submission);

        res.json(submission);
    } catch (error) {
        // const err = error as Error;
        // console.error('Error:', err);
        // next(err);
        next(error);
    }
};

// update form by id
export const updateFormSubmission = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const validatedData: PartialFormSubmissionInput = partialFormSubmissionSchema.parse(req.body);

        const submission = await prisma.formSubmission.update({
            where: {id: Number(id)},
            data: validatedData
        });

        console.log('Form submission updated:', submission);

        res.json(submission);
    } catch (error) {
        // if (error instanceof Error) {
        //     console.error('Error:', error.message);
        //     next(error);
        // } else {
        //     console.error('An unknown error occurred while updating the form');
        //     next(new Error('An unknown error occurred while updating the form'));
        // }
        next(error);
    }
};