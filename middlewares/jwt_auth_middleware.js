import jwt from 'jsonwebtoken';

export const verifyUserToken = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
        const bearer = token.split(' ')[1];
        const decoded = jwt.verify(bearer, process.env.JWT_SECRET_KEY) 
            if(!decoded || !decoded.id){
                return res.sendForbidden(err.toString());
            }
        req.user = decoded;
        next();
    } catch (error) {
        return res.sendError('Token Missing');
    }
}

export const verifyIsAdmin = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
        const bearer = token.split(' ')[1];
        const decoded = jwt.verify(bearer, process.env.JWT_SECRET_KEY);
        if(!decoded ||!decoded.id){
            return res.sendForbidden(err.toString());
        }
        else if(decoded.role_id!== 1){
            return res.sendForbidden('Only Admin access is allowed');
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.sendError('Token Missing');
    }
}

export default verifyUserToken;