require('dotenv').config();
     const mongoose = require('mongoose');
     const bcrypt = require('bcryptjs');
     const Admin = require('./models/admin');

     if (!process.env.MONGODB_URI) {
       console.error('Error: MONGODB_URI is not defined in .env file');
       process.exit(1);
     }

     mongoose.connect(process.env.MONGODB_URI, {
       useNewUrlParser: true,
       useUnifiedTopology: true,
     }).then(() => {
       console.log('Connected to MongoDB');
     }).catch((error) => {
       console.error('MongoDB connection error:', error);
       process.exit(1);
     });

     const seedAdmin = async () => {
       try {
         const existingAdmin = await Admin.findOne({ email: 'campusadmin122@gmail.com' });
         if (existingAdmin) {
           console.log('Admin user already exists, deleting...');
           await Admin.deleteOne({ email: 'campusadmin122@gmail.com' });
         }

         const hashedPassword = await bcrypt.hash('campus122', 10);
         console.log('Generated hash:', hashedPassword); // Log hash for verification
         const admin = new Admin({
           email: 'campusadmin122@gmail.com',
           password: hashedPassword,
           role: 'admin'
         });
         await admin.save();
         console.log('Admin user created in admins collection');
       } catch (error) {
         console.error('Error creating admin:', error);
       } finally {
         mongoose.connection.close();
       }
     };

     seedAdmin();