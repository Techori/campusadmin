const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Employee = require('../models/Employee');
const Company = require('../models/Company');
const College = require('../models/College');

// JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies.token;
      }
      return token;
    }
  ]),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
  try {
    let user = null;
    
    // Check in Employee collection
    user = await Employee.findById(jwtPayload.id);
    if (user) {
      const company = await Company.findById(user.companyId);
      return done(null, { 
        ...user.toObject(), 
        type: 'employee',
        role: user.type, // 'employee', 'hr', or 'admin'
        company: company ? {
          _id: company._id,
          name: company.name,
          email: company.contactEmail
        } : null
      });
    }

    // Check in Company collection
    user = await Company.findById(jwtPayload.id);
    if (user) {
      return done(null, { 
        ...user.toObject(), 
        type: 'company',
        role: 'company_admin'
      });
    }

    // Check in College collection
    user = await College.findById(jwtPayload.id);
    if (user) {
      return done(null, { 
        ...user.toObject(), 
        type: 'college',
        role: 'college_admin'
      });
    }

    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google profile:', profile);
    const email = profile.emails[0].value;
    const fullName = profile.displayName;

    // Check in Employee collection
    let user = await Employee.findOne({ email });
    if (user) {
      if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }
      const company = await Company.findById(user.companyId);
      return done(null, { 
        ...user.toObject(), 
        type: 'employee',
        role: user.type, // 'employee', 'hr', or 'admin'
        company: company ? {
          _id: company._id,
          name: company.name,
          email: company.contactEmail
        } : null
      });
    }

    // Check in Company collection
    user = await Company.findOne({ contactEmail: email });
    if (user) {
      if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }
      return done(null, { 
        ...user.toObject(), 
        type: 'company',
        role: 'company_admin'
      });
    }

    // Check in College collection
    user = await College.findOne({ contactEmail: email });
    if (user) {
      if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }
      return done(null, { 
        ...user.toObject(), 
        type: 'college',
        role: 'college_admin'
      });
    }

    // If no user found, return message to contact admin
    return done(null, false, { message: 'Please contact your administrator to create an account for you.' });
  } catch (error) {
    console.error('Google auth error:', error);
    return done(error);
  }
}));

// Middleware to authenticate Google
const authenticateGoogle = passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false
});

module.exports = {
  passport,
  authenticateGoogle
}; 