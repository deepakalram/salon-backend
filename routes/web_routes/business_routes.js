import express from 'express';
import { addBusiness, getAllBusinesses ,addBusinessByUserId, getBusinessById, updateBusiness, deleteBusinessById, deleteAllBusinesses } from '../../controller/web_controller/business_controller.js';
import verifyUserToken from '../../middlewares/jwt_auth_middleware.js';

const router = express.Router();

router.post('/',verifyUserToken, addBusiness);
router.get('/',verifyUserToken, getAllBusinesses);
router.get('/:id',verifyUserToken, getBusinessById);
router.put('/:id',verifyUserToken, updateBusiness);
router.delete('/:id',verifyUserToken, deleteBusinessById)
router.delete('/',verifyUserToken, deleteAllBusinesses)
router.post('/user',verifyUserToken, addBusinessByUserId)

export default router;