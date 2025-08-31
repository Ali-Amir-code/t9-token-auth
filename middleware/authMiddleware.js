import User from "../models/User.js";
import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ msg: "Not authorized" });
    }
    const token = authorization.split(" ")[1];
    if(!token){
        return res.status(401).json({msg: "Not authorized"});
    }
    try{
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        if(!req.user) return res.status(401).json({msg: "Not authorized"}) ;
        next();

    }catch(e){
        if(e.name==='TokenExpiredError') return res.status(401).json({msg: "Token expired, Login again"});
        return res.status(401).json({msg: "Not authorized"});
    }
}