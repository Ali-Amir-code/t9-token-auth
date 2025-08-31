import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    refreshToken: {type: String},
}, {timestamps: true});

userSchema.pre('save', async function (next){
    if(!this.isModified('password')){
        return next();
    }
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

const userModel = mongoose.model('User', userSchema);

export default userModel;