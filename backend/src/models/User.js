import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        min: [3, 'Name must be at least 3 characters long'],
        max: [30, 'Name must be at most 30 characters long']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email address'
        ]
    },
    password: {
        type: String,
        required: true,
        trim: true,
        min: [6, 'Password must be at least 6 characters long'],
        max: [32, 'Password must be at most 32 characters long'],
        select: false
    },
    role: {
        type: String,
        enum: ['staff', 'admin'],
        default: 'staff'
    }
},  
    {
        timestamps: true
    }
);


// Presaving

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})


// Match Password

userSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}


export default mongoose.model('User', userSchema);