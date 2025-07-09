# 📄 Product Requirements Document (PRD)

## 🧠 Nombre del Proyecto
SaaS de Verificación de Usuario con Pagos y Automatización

## 🎯 Objetivo
Construir una aplicación web SaaS básica que permita autenticación de usuarios, gestión de métodos de pago y automatizaciones vía N8N.

---

## 🧩 Funcionalidades Clave

### 1. Setup Base
- Framework: Next.js + TypeScript
- Estilos: Tailwind CSS
- Plantilla: Vercel SaaS Starter

### 2. Autenticación
- Supabase Auth con email/password
- Tabla `profiles` con:
  - `id` (UUID)
  - `email`
  - `stripe_customer_id`
  - `created_at`
  - `updated_at`

### 3. Métodos de Pago
- Integración con Stripe (modo test)
- Formulario para agregar método de pago
- Mostrar en UI si el usuario ya lo ha configurado

### 4. Automatización con N8N
- Al login exitoso, se hace llamada HTTP a un Webhook de N8N
- N8N envía un email de bienvenida al usuario

---

## 🔧 Stack Tecnológico

- **Frontend:** Next.js, Tailwind, TypeScript
- **Auth y DB:** Supabase
- **Pagos:** Stripe (modo test)
- **Automatización:** N8N
- **Deploy:** Vercel
- **Herramientas opcionales:** Cursor, ShadCN, GitHub Copilot

