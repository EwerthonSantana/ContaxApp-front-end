# 🚀 Contax-Front | Contact Management System

**(Vue 3 front end)**

> Modern, responsive interface for the contact management system, built with Vue 3 and orchestrated with Docker Compose. This repository contains only the front-end application; the API lives in [ContaxApp-back-end](https://github.com/EwerthonSantana/ContaxApp-back-end).

---

## 🔑 Access and Test Credentials

To log in and try out the features, use the following credentials, which are inserted automatically into the database during _seeding_:

| Field        | Credential                    | Notes                                        |
| :----------- | :---------------------------- | :------------------------------------------- |
| **Username** | `ewerthon32santana@gmail.com` | Test user with full permissions (Role: Admin). |
| **Password** | `seila123`                    | Development password for initial access.      |

> **Security note:** these credentials are only for the development/test Docker environment and must not be used in production.

---

## 💻 Tech Stack

| Category             | Technology                                     | Version |
| :------------------- | :--------------------------------------------- | :------ |
| **Framework**        | Vue.js (Composition API)                       | 3.5     |
| **Language**         | TypeScript / JavaScript                        | —       |
| **Build tool**       | Vite                                           | 7       |
| **State management** | Pinia                                          | 3       |
| **Routing**          | Vue Router                                     | 4       |
| **UI**               | PrimeVue + PrimeFlex + PrimeIcons              | 4       |
| **HTTP client**      | Axios                                          | 1       |
| **Testing**          | Vitest + Vue Testing Library + Vue Test Utils  | 4       |
| **Orchestration**    | Docker / Docker Compose                        | —       |

## ✨ Main Features

- **JWT authentication:** login and session validation using tokens issued by the .NET API.
- **Entity management:** full CRUD (Create, Read, Update, Delete) for the `Contact` entity.
- **Responsive UI:** layout adapted for mobile and desktop.
- **Internal networking:** communicates with the API through Docker's internal network.

---

## ⚙️ How to Run (with Docker)

This project works together with the **Contax-API (.NET 9)** back end, and both must be on the same Docker network.

### Prerequisites

- **Docker**
- **Docker Compose** (usually included with Docker Desktop)

### 1. Create the shared network (required)

Since the front end and back end are separate projects, each with its own `docker-compose` file, they need an **external network** to communicate.

Open a terminal (in any directory) and create the network (only needed **once**):

```bash
docker network create minha_rede_global
```

### 2. Start the back end

Follow the [ContaxApp-back-end](https://github.com/EwerthonSantana/ContaxApp-back-end) README. The API runs on `localhost:8081`.

### 3. Start the front end

In this project's folder:

```bash
docker compose up -d --build
```

Open **http://localhost:8080**.

---

## 🧑‍💻 Local Development

```bash
npm install
npm run dev     # dev server (Vite)
npm test        # unit tests (Vitest)
npm run build   # production build
```

---

**Author:** Ewerthon Santana · [GitHub](https://github.com/EwerthonSantana) · [LinkedIn](https://www.linkedin.com/in/ewerthonsantana/)
