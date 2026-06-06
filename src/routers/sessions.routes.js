import { Router } from "express";

import passport from "passport";

import { generateToken } from "../utils/jwt.js";

const router = Router();

// REGISTER
router.post(
  "/register",

  passport.authenticate("register", {
    failureRedirect: "/api/sessions/failregister",
    session: false,
  }),

  async (req, res) => {
    res.send({
      status: "success",
      message: "Usuario registrado",
    });
  },
);

// LOGIN
router.post(
  "/login",

  passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin",
    session: false,
  }),

  async (req, res) => {
    const user = {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
    };

    const token = generateToken(user);

    res.cookie("coderCookieToken", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    res.send({
      status: "success",
      token,
    });
  },
);

// CURRENT
router.get(
  "/current",

  passport.authenticate("jwt", {
    session: false,
  }),

  (req, res) => {
    res.send({
      status: "success",
      payload: req.user,
    });
  },
);

// FAILS
router.get("/failregister", (req, res) => {
  res.send({ error: "Register Failed" });
});

router.get("/faillogin", (req, res) => {
  res.send({ error: "Login Failed" });
});

export default router;
