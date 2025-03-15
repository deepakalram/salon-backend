import Joi from 'joi';
import HmacSHA256 from 'crypto-js/hmac-sha256.js';
import { getValidationError } from '../../helper/joi_validation.js';
import db from '../../db/db.js';

export const forgot_password = async (req, res) => {
    try {
        let body = req.body;
        let reqSchema = {
            email: Joi.string().email().required(),
        }
        let validationError = await getValidationError(reqSchema, body)
        if (validationError.error) {
            res.sendInvalidRequest(validationError.message);
            return false;
        } else {
            let user = await db('users')
                .where({
                    email: body.email
                })
                .first();
            if (!user) {
                res.sendError("User not found");
                return false;
            }
            res.sendSuccess({
                user: user.email,
                resetToken: await new Buffer.from(JSON.stringify({
                    id: user.id,
                    date: Date.now()
                })).toString("base64")
            }, "Password Reset Token Generated Successfully");
        }
    } catch (error) {
        res.sendError(error.message);
    }
}

export const reset_password = async (req, res) => {
    try {
        let body = req.body;
        let reqSchema = {
            email: Joi.string().email().required(),
            resetToken: Joi.string().required(),
            new_password: Joi.string().min(8).required(),
        }
        let validationError = await getValidationError(reqSchema, body)
        if (validationError.error) {
            res.sendInvalidRequest(validationError.message);
            return false;
        } else {
            let user = await db('users')
                .where({
                    email: body.email,
                })
                .first();
            if (!user) {
                res.sendError("Invalid email");
                return false;
            }
            let hashedNewPassword = HmacSHA256(body.new_password, process.env.JWT_SECRET_KEY).toString();
            user.password_hash = hashedNewPassword;
            await db('users').update(user).where('id', user.id);
            res.sendSuccess({ user }, "Password Reset Success");
        }
    } catch (error) {
        res.sendError(error.message);
    }
}

export const change_password = async (req, res) => {
    try {
        let body = req.body;
        let reqSchema = {
            old_password: Joi.string().min(8).required(),
            new_password: Joi.string().min(8).required(),
        }
        let validationError = await getValidationError(reqSchema, body)
        if (validationError.error) {
            res.sendInvalidRequest(validationError.message);
            return false;
        } else {
            const id = req.user.id;
            if (!id) {
                res.sendError("User not authenticated");
                return false;
            }
            let user = await db('users')
            .where({
                id: id
            })
            .first();
            if(!user) {
                res.sendError("User not found");
                return false;
            }
            let hashedOldPassword = HmacSHA256(body.old_password, process.env.JWT_SECRET_KEY).toString();
            if (hashedOldPassword !== user.password_hash) {
                res.sendError("Invalid old password");
            } else {
                let hashedNewPassword = HmacSHA256(body.new_password, process.env.JWT_SECRET_KEY).toString();
                user.password_hash = hashedNewPassword;
                await db('users').update(user).where('id', user.id);
                res.sendSuccess({ user }, "Password has been changed successfully");
            }
        }
    } catch (error) {
        res.sendError(error.message);
    }
}

export default forgot_password;