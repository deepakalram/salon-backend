import express from 'express';
import { register, login, adminCreateUser } from '../../controller/web_controller/user_controller.js';
import verifyUserToken, { verifyIsAdmin } from '../../middlewares/jwt_auth_middleware.js';

const router = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Post a new user
 *     description: Post a user to the database.
 *     responses:
 *       200:
 *         description: Successful response.
 */
router.post('/register', register);
router.post('/login', login);
router.post('/createUser',verifyUserToken, verifyIsAdmin, adminCreateUser);

export default router;