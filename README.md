# Full-Stack PokeApp

A robust full-stack application built with **NestJS** and **Vue 3** that demonstrates secure user authentication and real-time data streaming. This project manages users and displays a live feed of Pokemon sprites using WebSockets.

## 🚀 Features

- **Secure Authentication**: Complete Login and Registration flows using JWT (JSON Web Tokens) and BCrypt hashing.
- **Real-Time Updates**: Live Pokemon sprite feed powered by **Socket.io** WebSockets.
- **Robust Architecture**: Built with modularity and scalability in mind (SOLID principles).
- **Containerized**: Fully Dockerized environments for both Development (Hot-Reload) and Production (Optimized).
- **Modern UI**: Responsive and clean interface using **TailwindCSS**.

## 🛠️ Tech Stack

### Backend
- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: Passport & JWT Strategies
- **Real-Time**: Socket.io Gateway

### Frontend
- **Framework**: [Vue 3](https://vuejs.org/) (Composition API)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Forms**: Vee-Validate

## ⚙️ Usage

The project is configured with Docker Compose for easy setup.

### Prerequisites
- [Docker](https://www.docker.com/) & Docker Compose installed.

### 1. Environment Setup
Copy the example environment file to create your local configuration:
```bash
cp .env.example .env
```
*Note: The default values in `.env.example` work out-of-the-box for local development.*

### 2. Run in Development Mode
Starts the application with hot-reloading enabled for both backend and frontend.

```bash
docker-compose -f docker-compose.dev.yml up --build
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3000](http://localhost:3000)

### 3. Run in Production/Test Mode
Simulates a production environment using optimized multi-stage builds and Nginx.

```bash
docker-compose -f docker-compose.test.yml up --build
```

- **Application**: [http://localhost:8080](http://localhost:8080) (or configured port)

## 📂 Project Structure

```
├── backend/            # NestJS API application
├── frontend/           # Vue 3 Client application
├── docker-compose.dev.yml   # Development orchestration
├── docker-compose.test.yml  # Production orchestration
└── .env.example        # Environment variables template
```

---

# Requisitos de Seguridad Implementados (OWASP Top 10)

Este proyecto cumple estrictamente con los siguientes controles de seguridad:

## A01:2021 – Broken Access Control
- **Backend**: Rutas protegidas con `@UseGuards(AuthGuard('jwt'))`.
- **Frontend**: Route guards en Vue Router para prevenir acceso no autorizado.

## A02:2021 – Cryptographic Failures
- **Contraseñas**: Hashing seguro utilizando `bcrypt` con Salt Rounds = 10.
- **Secretos**: Gestión mediante variables de entorno (`ConfigModule`), nunca hardcodeados.
- **JWT**: Tokens firmados con algoritmo HS256 y expiración configurable.
- **Transmisión**: Uso de **HTTP-Only Cookies** para almacenamiento seguro del token (SameSite: Strict).

## A03:2021 – Injection
- **SQL**: Uso de **TypeORM** y Repository Pattern para prevenir SQL Injection.
- **Validación**: DTOs estrictos con `class-validator` y `ValidationPipe` global (whitelist/forbidNonWhitelisted) para sanitizar toda entrada.

## A04:2021 – Insecure Design
- **Rate Limiting**: Implementado `ThrottlerModule` para mitigar ataques de fuerza bruta.
- **Separación de Ambientes**: Configuraciones Docker diferenciadas para Dev y Prod.

## A05:2021 – Security Misconfiguration
- **CORS**: Configuración restrictiva (`origin: frontend_url`, `credentials: true`), prohibiendo el uso de wildcard `*`.
- **Errores**: `AllExceptionsFilter` global para ocultar stack traces y detalles internos al cliente (Generic Error Messages).

## A07:2021 – Identification and Authentication Failures
- **Complejidad de Contraseña**: Enforced regex (Upper, Lower, Number, Special char) y longitud mínima.
- **Respuestas Genéricas**: "Invalid credentials" para evitar enumeración de usuarios.

## A08:2021 – Software and Data Integrity Failures
- **Integridad**: Validación de respuestas de APIs externas (PokeAPI) antes de procesarlas.
- **Lockfile**: Uso de `package-lock.json` para consistencia de dependencias.

## A09:2021 – Security Logging and Monitoring Failures
- **Logging**: Implementación de `Logger` de NestJS para registrar eventos críticos (Login success/fail, conexiones WS, errores).

## A10:2021 – Server-Side Request Forgery (SSRF)
- **Control de Peticiones**: URLs de APIs externas construidas internamente con parámetros validados, sin permitir input directo de URL por parte del usuario.
