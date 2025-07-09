# SaaS Starter - Prueba Técnica Nufi

## Descripción

Aplicación web SaaS básica que integra autenticación, pagos con Stripe y notificaciones automáticas con N8N, desarrollada con Next.js, TypeScript, Tailwind CSS y Supabase.

---

## Funcionalidades implementadas

- Registro e inicio de sesión con Supabase Auth
- Manejo de perfiles de usuario en Supabase
- Integración con Stripe para agregar métodos de pago (modo test)
- Interfaz responsiva con Tailwind CSS
- Middleware para manejo de sesiones y cookies con Supabase SSR
- Documentación técnica y video demostrativo (en proceso)

---

## Cómo ejecutar el proyecto

### Requisitos

- Node.js v18+
- pnpm (recomendado) o npm/yarn
- Cuenta en Supabase y Stripe (modo test)
- Variables de entorno configuradas (ver `.env.example`)

### Instalación

```bash
git clone https://github.com/tu-usuario/saas-starter.git
cd saas-starter
pnpm install
