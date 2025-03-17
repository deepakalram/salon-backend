import express from 'express';
import { addBusiness, getAllBusinesses, getBusinessById, updateBusiness, deleteBusinessById, deleteAllBusinesses } from '../../controller/web_controller/business_controller.js';

const router = express.Router();

router.post('/', addBusiness);
router.get('/', getAllBusinesses);
router.get('/:id', getBusinessById);
router.put('/:id', updateBusiness);
router.delete('/:id', deleteBusinessById)
router.delete('/', deleteAllBusinesses)

export default router;