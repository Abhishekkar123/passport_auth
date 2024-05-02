const passport=require("passport");
const LocalStrategy = require('passport-local').Strategy;
const userModel=require('../configs/database');
const { compareSync } = require("bcrypt");


passport.use(new LocalStrategy(
    async function (username, password, done) {
        try {
            const user = await userModel.findOne({ username: username });

            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            if (!compareSync(password, user.password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));
  passport.serializeUser(function (user, done) {
    done(null, user.id);
});

//Fetches session details using session id
passport.deserializeUser(async function (id, done) {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});