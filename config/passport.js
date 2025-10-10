import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import User from '../models/User.model.js';
import dotenv from "dotenv";

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({email: profile.emails[0].value})
        if (user) {
            user.googleId = profile.id;
            user.image = user.image || profile.photos[0]?.value;
            await user.save();
            return done(null, user)
        }else {
        user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0]?.value,
            googleId: profile.id,
            phones: "",
        });
        }

        await user.save();
        done(null, user)
    } catch (e) {
        console.error("Google OAuth error:", e);

        done(e, null)
    }
}));
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (e) {
        done(e, null);
    }
});
export default passport;