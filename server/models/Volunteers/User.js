import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: String,
        enum: ['Local Guardian', 'Educator', 'Admin'],
        required: true
    },
    bio: {
        type: String,
        default: ''
    },
    picture: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);

export default User;