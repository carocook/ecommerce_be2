import dotenv from "dotenv";

dotenv.config();

import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import { UserModel } from "../model/userModel.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import PRIVATE_KEY from "../utils/jwt.js";

const LocalStrategy = local.Strategy;
const JwtStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const cookieExtractor = (req) => {
  let token = null;

  if (req && req.cookies) {
    token = req.cookies["coderCookieToken"];
  }

  return token;
};

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },

      async (req, username, password, done) => {
        try {
          const { first_name, last_name, age } = req.body;

          const exists = await UserModel.findOne({
            email: username,
          });

          if (exists) {
            return done(null, false);
          }

          const user = await UserModel.create({
            first_name,
            last_name,
            age,
            email: username,
            password: createHash(password),
          });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },

      async (username, password, done) => {
        try {
          const user = await UserModel.findOne({
            email: username,
          });

          if (!user) {
            return done(null, false);
          }

          if (!isValidPassword(user, password)) {
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),

        secretOrKey: PRIVATE_KEY,
      },

      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
};

export default initializePassport;
