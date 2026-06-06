# 🛒 Ecommerce Backend API

Backend de un sistema de ecommerce desarrollado con Node.js, Express y MongoDB.  
Incluye autenticación, manejo de roles, carrito de compras, sistema de tickets y recuperación de contraseña mediante email.

---

## 🚀 Tecnologías utilizadas

- Node.js
- Express
- MongoDB + Mongoose
- Passport (JWT + Local)
- JSON Web Token (JWT)
- Nodemailer (Gmail SMTP)
- Cookie Parser
- Dotenv

---

## 🧱 Arquitectura del proyecto

El proyecto sigue una arquitectura modular basada en capas:

- **Models (DAO)**: Definición de esquemas de MongoDB
- **Repositories**: Acceso y manejo de datos
- **Routes**: Endpoints de la API
- **Middlewares**: Autenticación y autorización
- **Services**: Lógica de negocio (compra, mails)
- **DTOs**: Filtrado de información sensible

---

## 🔐 Autenticación y roles

Se implementa autenticación con JWT y manejo de roles:

- `admin` → acceso completo a productos
- `user` → acceso a carrito y compras

Middleware de autorización aplicado en rutas protegidas.

---

## 🛍️ Funcionalidades principales

### 👤 Usuarios

- Registro de usuarios
- Login con JWT
- Endpoint `/current` con DTO

### 📦 Productos

- Crear, actualizar y eliminar productos (solo admin)
- Listado y filtrado de productos

### 🛒 Carrito

- Crear carrito por usuario
- Agregar productos
- Eliminar productos
- Vaciar carrito

### 💳 Compra

- Validación de stock
- Descuento automático de inventario
- Generación de ticket de compra
- Separación de productos no disponibles

### 🎟️ Tickets

- Código único de compra
- Total de la compra
- Productos comprados
- Usuario comprador

### 📧 Recuperación de contraseña

- Envío de email con Nodemailer
- Token con expiración de 1 hora
- Reset de contraseña seguro
- Validación de contraseña anterior

---

## 🔒 Seguridad

- Passwords encriptadas con bcrypt
- JWT con expiración
- Cookies httpOnly
- Validación de roles en rutas
- Protección de endpoints sensibles

---
