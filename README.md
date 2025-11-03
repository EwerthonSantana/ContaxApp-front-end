# 🚀 Contax-Front | Sistema de Gestão de Contatos

**(Frontend Vue.js)**

> Interface moderna e responsiva para o sistema de gestão de contatos, construída com Vue.js e orquestrada via Docker Compose. Este repositório contém apenas a aplicação Frontend.

---

## 💻 Tecnologias Utilizadas

| Categoria                 | Tecnologia                           | Versão                         |
| :------------------------ | :----------------------------------- | :----------------------------- |
| **Framework**             | Vue.js                               | 3.x (Composition API)          |
| **Linguagem**             | TypeScript                           | (ou JavaScript, se for o caso) |
| **Tooling**               | Vite (ou Vue CLI)                    | Mais recente                   |
| **Gerenciador de Estado** | Pinia (ou Vuex)                      |                                |
| **Estilização**           | (Ex: Tailwind CSS, Vuetify, ou SCSS) |                                |
| **Orquestração**          | Docker                               |                                |

## ✨ Funcionalidades Principais

- **Autenticação JWT:** Login e validação de sessão utilizando tokens fornecidos pela API .NET.
- **Gestão de Entidades:** CRUD completo (Create, Read, Update, Delete) para a entidade `Contato`.
- **Interface Responsiva:** Layout adaptável para dispositivos móveis e desktop.
- **Comunicação Segura:** Conexão otimizada com a API via rede interna do Docker.

---

## ⚙️ Como Executar o Projeto (Com Docker)

Este projeto funciona em conjunto com o backend **Contax-API (.NET 9)** e requer que ambos estejam na mesma rede Docker.

### Pré-Requisitos

Certifique-se de ter instalado na sua máquina:

- **Docker**
- **Docker Compose** (geralmente incluído na instalação do Docker Desktop)

### 1. Configurar a Rede Compartilhada (Obrigatório)

Como o Frontend e o Backend são projetos separados com seus próprios arquivos `docker-compose.yml`, eles precisam de uma **rede externa** para se comunicarem.

Abra o seu terminal (em qualquer diretório) e crie a rede (Este passo só é necessário **uma vez**):

```bash
docker network create minha_rede_global
```
