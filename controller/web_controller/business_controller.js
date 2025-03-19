import Joi from 'joi';
import { getValidationError } from '../../helper/joi_validation.js';
import db from '../../db/db.js';

export const addBusinessByUserId = async (req, res) => {
    try {
        let body = req.body;
        let user_id = req.body.user_id;
        let reqSchema = {
            user_id: Joi.number().required(),
            name: Joi.string().required(),
            logo_url: Joi.string().required(),
            business_type_id: Joi.number().required(),
            business_details_id: Joi.number().required(),
            business_theme_id: Joi.number(),
        }

        let validationError = await getValidationError(reqSchema, body)
        if (validationError.error) {
            res.sendInvalidRequest(validationError.message);
            return false
        }
        let business = await db('businesses')
            .insert({
                name: body.name,
                logo_url: body.logo_url,
                business_type_id: body.business_type_id,
                business_details_id: body.business_details_id,
                business_theme_id: body.business_theme_id,
            })
        if (business.length == 0) {
            res.sendError("Business not created");
            return false;
        } else {
            let user = await db('users')
                .update({
                    business_id: business[0],
                })
                .where({ id: user_id })

            if (!user) {
                res.sendError("User not updated");
                return false;
            } else {
                res.sendCreated("Business created successfully for given user", { business: business });
            }
        }
    } catch (error) {
        res.sendError(error.message);
    }
}

export const addBusiness = async (req, res) => {
    try {
        let body = req.body;
        let reqSchema = {
            name: Joi.string().required(),
            logo_url: Joi.string().required(),
            business_type_id: Joi.number().required(),
            address: Joi.string().required(),
            no_of_branches: Joi.number().required(),
            no_of_staff: Joi.number().required(),
        }

        let validationError = await getValidationError(reqSchema, body)
        if (validationError.error) {
            res.sendInvalidRequest(validationError.message);
            return false
        }

        let businessDetails = await db('business_details')
            .insert({
                address: body.address,
                no_of_branches: body.no_of_branches,
                no_of_staff: body.no_of_staff,
            })
        let business = await db('businesses')
            .insert({
                name: body.name,
                logo_url: body.logo_url,
                business_type_id: body.business_type_id,
                business_details_id: businessDetails[0],
            })

        if (!business) {
            res.sendError("Business not created");
            return false;
        } else {
            res.sendCreated("Business created successfully", { business: business });
        }
    } catch (error) {
        res.sendError(error.message);
    }
}

export const getAllBusinesses = async (req, res) => {
    try {
        let page_number = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        let offset = (page_number - 1) * limit;
        let business = await db('businesses')
            .join('business_types', 'business_types.id', 'businesses.business_type_id',)
            .join('business_details', 'business_details.id', 'businesses.business_details_id')
            .where({ is_deleted: false })
            .limit(limit)
            .offset(offset)
        if (business.length === 0) {
            res.sendError("Business not found");
            return false;
        }
        res.sendSuccess({ business }, "Business found");
        console.log(business)
    } catch (error) {
        res.sendError(error.message);
    }
}

export const getBusinessById = async (req, res) => {
    try {
        let businessId = req.params.id;
        let business = await db('businesses')
            .where({ id: businessId, is_deleted: false })
            .first();
        if (!business) {
            res.sendError("Business not found");
            return false;
        }
        res.sendSuccess({ business }, "Business found");
    } catch (error) {
        res.sendError(error.message);
    }
}

export const updateBusiness = async (req, res) => {
    try {
        let businessId = req.params.id;
        let business = await db('businesses')
            .where({ id: businessId, is_deleted: false })
            .update({
                name: req.body.name,
                logo_url: req.body.logo_url,
            });
        let businessDetails = await db('business_details')
            .where({ id: businessId })
            .update({
                address: req.body.address,
                no_of_branches: req.body.no_of_branches,
                no_of_staff: req.body.no_of_staff,
            });
        if (business.is_deleted == true){
            res.sendError("Business might have been deleted")
            return false;
        }
        if (!business) {
            res.sendError("Business not updated");
            return false;
        } else {
            res.sendUpdated("Business updated successfully", { business: business });
        }
    } catch (error) {
        res.sendError(error.message);
    }
}

export const deleteBusinessById = async (req, res) => {
    try {
        let businessId = req.params.id;
        let business = await db('businesses')
            .where({ id: businessId, is_deleted: false })
            .update({ is_deleted: true });

        let user = await db('users')
            .where({ business_id: businessId })
            .update({ business_id: null })

        if (business.length === 0) {
            res.sendError("No business found");
        }
        res.sendDeleted("Business deleted successfully");
    } catch (error) {
        res.sendError(error.message);
    }
}

export const deleteAllBusinesses = async (req, res) => {
    try {
        let business = await db('businesses')
            .update({ is_deleted: true });
        if (!business) {
            res.sendError("All businesses not deleted");
            return false;
        }
        res.sendDeleted("All businesses deleted successfully");
    } catch (error) {
        console.log(error)
        res.sendError(error.message);
    }
}

export default addBusiness;