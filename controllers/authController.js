import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator'

export const genTokens = (userId) => {
    const accessToken = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
    return { accessToken, refreshToken };
}

export const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }
        user = new User({ name, email, password });
        await user.save();

        res.status(201).json({ msg: "User registered successfully" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: "Server Error" });
    }
}

export const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ "Errors": errors.array() });
    }
    const { email, password } = req.body;

    try {
        const user = await User.findOne({email});
         if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({msg: "Invalid Credentials"});
        }
        const {accessToken, refreshToken} = genTokens(user._id);
        user.refreshToken = refreshToken;
        await user.save();
        res.json({refreshToken, accessToken});
    }catch(e){
        console.error(e);
        res.status(500).json({msg: "Server Error"});
    }
}

export const refreshToken = async (req, res) => {
    const {token} = req. body;

    if(!token){
        return res.status(400).json({msg: "No Token provided"});
    }

    try{
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_EXPIRY);

        const user = User.findById(decoded.id);
        if(!user || user.refreshToken !== token){
            res.status(400).json({msg: "Invalid Token provided"});
        }
        const {accessToken, refreshToken: newRefreshToken} = genTokens(user._id);

        user.refreshToken = newRefreshToken;
        await user.save();

        res.json({accessToken, refreshToken: newRefreshToken});
    }catch(e){
        return res.status(500).json({msg: "Server Error"});
    }
}

export const logoutUser = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ msg: 'Refresh token is required' });
  }

  try {
    // Find user by refresh token and invalidate it
    const user = await User.findOne({ refreshToken: token });
    if (user) {
      user.refreshToken = null; // Or undefined
      await user.save();
    }
    res.status(200).json({ msg: 'Logged out successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};