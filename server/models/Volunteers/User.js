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
    },
    isRestricted: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'approved', 'declined'],
        default: 'declined'
    },
    nidNumber: {
        type: String,
        default: ''
    },
    certificatePicture: {
        type: String,
        default: ''
    },
    educationLevel: {
        type: String,
        default: ''
    },
    institution: {
        type: String,
        default: ''
    },
    major: {
        type: String,
        default: ''
    },
    age: {
        type: Number,
        default: null
    },
    sscPassingYear: {
        type: String,
        default: ''
    },
    sscInstitute: {
        type: String,
        default: ''
    },
    hscPassingYear: {
        type: String,
        default: ''
    },
    hscInstitute: {
        type: String,
        default: ''
    },
    universityName: {
        type: String,
        default: ''
    },
    universityPassingYear: {
        type: String,
        default: ''
    },
    currentlyStudying: {
        type: Boolean,
        default: false
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