import jwt from 'jsonwebtoken';
import { UserAttributes } from '../types/user.types';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = async (user: UserAttributes) => {
    return jwt.sign({
        role: user.role,
        email: user.email,
        id: user.id
    }, process.env.JWT_SECRET || "", {
        expiresIn: '24h'
    });
}

export { generateToken };