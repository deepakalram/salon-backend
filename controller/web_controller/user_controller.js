import Joi from 'joi';
import HmacSHA256 from 'crypto-js/hmac-sha256.js';
import { generateJWTToken } from '../../middlewares/auth_middleware.js';
import { getValidationError } from '../../helper/joi_validation.js';
import db from '../../db/db.js';

export const register = async (req, res) => {
    try {
        let body = req.body;
        let reqSchema = {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password_hash: Joi.string().min(8).required(),
            phone: Joi.number().required(),
            business_id: Joi.number().required(),
            role_id: Joi.number().required(),
        }
        let validationError = await getValidationError(reqSchema, body)
        if (validationError.error) {
            res.sendInvalidRequest(validationError.message);
            return false
        }
        let hashedPassword = HmacSHA256(body.password_hash, process.env.JWT_SECRET_KEY).toString();
        let user = await db('users').insert({
            name: body.name,
            email: body.email,
            password_hash: hashedPassword,
            phone: body.phone,
            business_id: body.business_id,
            role_id: body.role_id,
        })
        if (!user) {
            res.sendError("User not created");
            return false;
        } else {
            res.sendCreated("User created successfully", user);
        }
    } catch (error) {
        res.sendError(error.message);
    }
}

export const login = async (req, res) => {
    try {
        let body = req.body;
        let reqSchema = {
            email: Joi.string().email().required(),
            password_hash: Joi.string().min(8).required(),
        }
        let validationError = await getValidationError(reqSchema, body)
        if (validationError.error) {
            res.sendInvalidRequest(validationError.message);
            return false;
        } else {
            let hashedPassword = HmacSHA256(body.password_hash, process.env.JWT_SECRET_KEY).toString();
            let user = await db('users')
                .where({
                    email: body.email,
                    password_hash: hashedPassword
                })
                .first();
            if (!user) {
                res.sendError("Invalid email or password");
                return false;
            }
            res.sendSuccess({ user, token: await generateJWTToken(user) }, "User Login Success");
        }
    } catch (error) {
        res.sendError(error.message);
    }
}

export default register;