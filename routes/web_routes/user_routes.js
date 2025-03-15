import express from 'express';
import { forgot_password, reset_password, change_password } from '../../controller/web_controller/user_controller.js';
import verifyUserToken from '../../middlewares/jwt_auth_middleware.js';

const router = express.Router();

router.post('/forgot-password', forgot_password);
router.put('/reset-password', reset_password);
router.put('/change-password',verifyUserToken, change_password);

export default router;