import JWT from 'jsonwebtoken';

export const generateToken = (id,role,res)=> {
    const token = JWT.sign({ id,role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    return token;
}