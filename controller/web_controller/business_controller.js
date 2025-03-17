import Joi from 'joi';
import { getValidationError } from '../../helper/joi_validation.js';
import db from '../../db/db.js';

export const addBusiness = async (req, res) => {
    try {
        let body = req.body;
        let reqSchema = {
            name: Joi.string().required(),
            logo_url: Joi.string().required(),
            business_type_id: Joi.number().required(),
            business_details_id: Joi.number().required(),
            business_theme_id: Joi.number().required(),
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
        if (!business) {
            res.sendError("Business not created");
            return false;
        } else {
            res.sendCreated("Business created successfully", {business: business});
        }
    } catch (error) {
        res.sendError(error.message);
    }
}

export const getAllBusinesses = async (req, res) => {
    try {
        let business = await db('businesses')
        .whereNull('deleted_at');
        if (business.length == 0) {
            res.sendError("Business not found");
            return false;
        }
        res.sendSuccess({business}, "Business found");
        console.log(business)
    } catch (error) {
        res.sendError(error.message);
    }
}

export const getBusinessById = async (req, res) => {
    try {
        let businessId = req.params.id;
        let business = await db('businesses')
           .where({ id: businessId })
           .whereNull('deleted_at')
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
        .where({ id: businessId })
        .whereNull('deleted_at')
        .update({
            name: req.body.name,
            logo_url: req.body.logo_url,
            business_type_id: req.body.business_type_id,
            business_details_id: req.body.business_details_id,
            business_theme_id: req.body.business_theme_id,
        });
        if (!business) {
            res.sendError("Business not updated");
            return false;
        } else {
            res.sendUpdated("Business updated successfully", {business: business});
        }
    } catch (error) { 
        res.sendError(error.message);
    }
}

export const deleteBusinessById = async (req, res) => {
    try {
        let businessId = req.params.id;
        let business = await db('businesses')
        .where({ id: businessId })
        .update({ deleted_at: db.fn.now()});
        if (!business) {
            res.sendError("Business not deleted");
            return false;
        }
        res.sendDeleted("Business deleted successfully");
    } catch (error) {
        res.sendError(error.message);
    }
}

export const deleteAllBusinesses = async (req, res) => {
    try {
        let business = await db('businesses')
        .update({ deleted_at: db.fn.now()});
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