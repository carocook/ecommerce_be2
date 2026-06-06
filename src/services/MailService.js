import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendRecoveryEmail = async (email, token) => {
  try {
    console.log("ANTES DE ENVIAR MAIL");

    const link = `http://localhost:3000/reset-password?token=${token}`;

    const info = await transport.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Recuperación de contraseña",
      html: `<a href="${link}">Restablecer contraseña</a>`,
    });

    console.log("MAIL ENVIADO OK:", info.messageId);
  } catch (error) {
    console.log("❌ ERROR REAL DE GMAIL:");
    console.log(error);
  }
};
