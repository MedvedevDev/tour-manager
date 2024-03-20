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
        minlength: 8
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
    }
})

// Password encryption (hashing) in pre-save middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    
    // Delete password confirm field
    this.passwordConfirm = undefined;
})

const User = mongoose.model('User', userSchema);

module.exports = User;