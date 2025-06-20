const mongoose = require('mongoose');
   const bcrypt = require('bcryptjs');

   const adminSchema = new mongoose.Schema({
     email: {
       type: String,
       required: [true, 'Email is required'],
       unique: true,
       trim: true,
       lowercase: true,
       match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
     },
     password: {
       type: String,
       required: [true, 'Password is required'],
       minlength: [6, 'Password must be at least 6 characters']
     },
     role: {
       type: String,
       default: 'admin',
       enum: ['admin']
     }
   }, {
     timestamps: true
   });

   // Hash password before saving
   adminSchema.pre('save', async function (next) {
     if (!this.isModified('password')) return next();
     this.password = await bcrypt.hash(this.password, 10);
     next();
   });

   module.exports = mongoose.model('Admin', adminSchema);