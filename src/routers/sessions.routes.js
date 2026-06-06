import { Router } from "express";
import passport from "passport";
import UserCurrentDTO from "../dto/UserCurrentDTO.js";
import { sendRecoveryEmail } from "../services/MailService.js";
import { UserModel } from "../model/userModel.js";
import { generateToken, generateRecoveryToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";
import { createHash, isValidPassword } from "../utils/bcrypt.js";

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

// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    const token = generateRecoveryToken(email);

    await sendRecoveryEmail(email, token);

    res.send({
      status: "success",
      message: "Correo de recuperación enviado",
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      error: error.message,
    });
  }
});

// RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  try {
    const data = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    const user = await UserModel.findOne({ email: data.email });

    if (!user) {
      return res.status(404).send({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    if (isValidPassword(user, password)) {
      return res.status(400).send({
        status: "error",
        message: "No podés usar la misma contraseña anterior",
      });
    }

    user.password = createHash(password);

    await user.save();

    res.send({
      status: "success",
      message: "Contraseña actualizada",
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: "Token inválido o expirado",
    });
  }
});

export default router;
