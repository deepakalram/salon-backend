import express from 'express';
import { register, login } from '../../controller/web_controller/user_controller.js';

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

export default router;