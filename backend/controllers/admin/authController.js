const jwt = require('jsonwebtoken');
   const bcrypt = require('bcryptjs');
   const Admin = require('../../models/admin');

   const generateToken = (user) => {
     return jwt.sign(
       { id: user._id, email: user.email, role: user.role },
       process.env.JWT_SECRET || 'your_jwt_secret',
       { expiresIn: '1h' }
     );
   };

exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Print the hash of the incoming password
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log('Hash of incoming password:', hashedPassword);

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email ' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid  password' });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Sign-in error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};