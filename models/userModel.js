const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Invalid email format']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8,
        select: false // do not show this field in an output
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Need to confirm'],
        validate: {
            // Only works on CREATE and SAVE
            validator: function(el) {
                return el === this.password; 
            },
            message: 'Passwords are not the same'
        }
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'guide', 'lead-guide'],
        default: 'user'
    },
    passwordChangetAt: Date     
})

// Password encryption (hashing) in pre-save middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    
    // Delete password confirm field
    this.passwordConfirm = undefined;
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangetAt) {
        const changedTimestamp = parseInt(this.passwordChangetAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }

    return false;   
}

const User = mongoose.model('User', userSchema);

module.exports = User;