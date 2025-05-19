import {Router} from 'express';
import * as controller from '../controllers/formController';

const router = Router();

// static-routes before dynamic-routes(route with params)
router.get('/submissions', controller.listFormSubmissions);
router.get('/submissions/:id', controller.getFormSubmission);
router.post('/submissions', controller.createFormSubmission);
router.patch('/submissions/:id', controller.updateFormSubmission);
router.delete('/submissions/:id', controller.deleteFormSubmission);

export default router;