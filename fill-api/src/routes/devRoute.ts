import { Router } from "express";
import * as controller from '../controllers/devController'


const router = Router();
router.get('/reset-rate-limit', controller.resetRateLimit);

export default router;


// to reset rate limit 
// example --> http://localhost:8899/dev/reset-rate-limit

// /dev/reset-rate-limit                 (reset for ip that make request)      
// /dev/reset-rate-limit?ip=<target-ip>  (reset for target specific ip)