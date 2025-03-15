import jwt from 'jsonwebtoken';

export const generateJWTToken = async (payload) => {
    return jwt.sign({
        email: payload.email,
        id: payload.id,
        role_id: payload.role_id,
        business_id: payload.business_id
    },
        process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
}

export default generateJWTToken;