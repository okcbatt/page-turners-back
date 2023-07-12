const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const {
  createUser,
  getAllUsers,
  getUserByUsername,
  getUserById,
  updateUser,
  destroyUser,
  getUser,
  getUserByEmail,
} = require("./db/users");

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        try {
          let existingUser = await getUserByEmail({
            "google.email": profile.emails[0],
          });
          // if user exists return the user
          if (existingUser) {
            return done(null, existingUser);
          }
          // if user does not exist create a new user
          console.log("Creating new user...");
          const newUser = await createUser(
            profile.displayName,
            profile.id,
            "", // Set a temporary password or leave it empty
            profile.emails[0].value,
            false, // Set is_admin to false
            // profile.photos[0].value, to set Avatar
            null,
            "", // other profile information if desired
            "",
            "",
            ""
          );

          return done(null, newUser);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  // Add the JWT strategy
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromHeader("authorization"),
        secretOrKey: "secretKey",
      },
      async (jwtPayload, done) => {
        try {
          // Extract user
          const user = jwtPayload.user;
          done(null, user);
        } catch (error) {
          done(error, false);
        }
      }
    )
  );
};

//
