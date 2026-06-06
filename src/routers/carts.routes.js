import { Router } from "express";
import passport from "passport";
import CartRepository from "../repositories/CartRepository.js";
import { purchaseCart } from "../services/purchase.service.js";

const router = Router();

// crear carrito
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const cart = await CartRepository.createCart(req.user.id);
    res.send({ status: "success", cart });
  },
);

// ver carrito
router.get("/:cid", async (req, res) => {
  const cart = await CartRepository.getCartById(req.params.cid);
  res.send(cart);
});

// agregar producto
router.post("/:cid/product/:pid", async (req, res) => {
  const cart = await CartRepository.addProductToCart(
    req.params.cid,
    req.params.pid,
  );

  res.send({
    status: "success",
    cart,
  });
});

// eliminar producto
router.delete("/:cid/product/:pid", async (req, res) => {
  const cart = await CartRepository.removeProductFromCart(
    req.params.cid,
    req.params.pid,
  );

  res.send({
    status: "success",
    cart,
  });
});

// vaciar carrito
router.delete("/:cid", async (req, res) => {
  const cart = await CartRepository.clearCart(req.params.cid);

  res.send({
    status: "success",
    cart,
  });
});

//ticket de compra
router.post(
  "/:cid/purchase",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const ticket = await purchaseCart(req.params.cid, req.user.email);

      res.send({
        status: "success",
        ticket,
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message,
      });
    }
  },
);

export default router;
