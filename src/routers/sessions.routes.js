import { Router } from "express";
import passport from "passport";
import { generateToken } from "../utils/jwt.js";
import UserCurrentDTO from "../dto/UserCurrentDTO.js";

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
      first_name: req.user.first_name,
      last_name: req.user.last_name,
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
    const userDTO = new UserCurrentDTO(req.user);

    res.send({
      status: "success",
      payload: userDTO,
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
