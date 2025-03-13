import Joi from "joi";

export const getValidationError = async (validationObject, reqBody) => {
    try {
        const schema = Joi.object().keys(validationObject);
        const schemaError = schema.validate(reqBody).error;

        if (schemaError) {
            return { error: true, message: schemaError?.details[0]?.message }
        } else {
            return { error: false, message: "" }
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

export default getValidationError;