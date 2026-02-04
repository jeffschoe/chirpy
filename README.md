# chirpy
A guided project from Boot.dev: build an HTTP Server in TypeScript.

chirpy 🐦 is an HTTP server written in TypeScript with Express.

This HTTP server exposes a few different HTTP endpoints allowing users to log in, submit posts or "chirps", aggregate posts, and delete them. It was built as a learning exercise following Boot.dev’s guided materials, helping me deepen my understanding of working with TypeScript, building HTTP servers in Express, interacting with an SQL database, and using an ORM.

- [Getting Started](#-getting-started)
- [HTTP Endpoints](./ENDPOINTS.md)

---

## 🔍 Overview

**What it does**

- Opens up an HTTP server on localhost
- Responds to HTTP requests
- Normalizes and stores chirps in a database
- Authenticates users and manages endpoint authorization
- Uses modern TypeScript tooling

This was a guided build — I didn’t have full code solutions, but I followed along with the goals and instructions to complete the project, making it a great learning experience.

See the lessons for yourself: [Boot.dev: Build an HTTP Server in TypeScript](https://www.boot.dev/lessons/3c83ee38-8e4a-4ab2-8a52-41e15dea698f)


---

## 📦 Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Web Framework:** Express
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Unit Testing:** Vitest
- **Password Hashing:** Argon2
- **Authentication:** JWT

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:

- Node.js v22+ (developed and tested on v22.20.0)
- npm (comes with Node.js)
- PostgreSQL 16+ (developed and tested on 16.11)

### Installation

Clone the repo:

```bash
git clone https://github.com/jeffschoe/chirpy
cd chirpy
```
Install dependencies:

```bash
npm install
```

### Configuration:

Chirpy uses a `.env` file stored in the project root directory.

The file must contain the following variables:

- `DB_URL`
- `PORT`
- `PLATFORM`
- `JWT_SECRET`
- `POLKA_KEY`

You can create a `JWT_SECRET` in the command line using: 

```bash
openssl rand -base64 64
```

Example: 

```env
DB_URL="postgres://user:password@localhost:5432/chirpy?sslmode=disable"
PORT="8080"
PLATFORM="dev"
JWT_SECRET="ZA4zm3djPFThz7UT1K0zYTqY6sWgE0p0pmqhAHclgWWu+793VhiB/I3uByxx5m4UyyKGmP/etyyuagxf7iDuxg"
POLKA_KEY="f271c81ff7084ee5b99a5091b42d486e"
```

POLKA_KEY is a pretend API key used only for Boot.dev tests; it is not a real, sensitive API key.

### Database setup (brief)

This project assumes you already have:

- PostgreSQL installed and running
- A database created (e.g. `chirpy`)

You’ll need a connection string for the database, which you’ll place in the `DB_URL` field of `.env`.

### Start the server:

```bash
npm run dev
```

The server should now be running and accessible on the specified localhost port.

To see logging, run:

```bash
npm run dev | tee server.log
```

See NOTES.md for additional tips...

---

## 💡 HTTP Endpoints

Chirpy exposes a small REST API for managing users and chirps.

For full details on all routes, request bodies, responses, and error codes, see:

- [API Endpoints](./ENDPOINTS.md)

---

## 🛠️ What I Learned

This project helped me get comfortable with:

- Express
- HTTP requests
- REST APIs
- Query parameters

---

## 🚧 Current Limitations

- More to come

---

## ✅ Upgrades From Base Project

Improvements, fixes, or other notable upgrades I have implemented beyond the base project:

- Documented endpoints in great detail in this README
- Upgraded the `/api/chirps` endpoint to dynamically build a query for filtering/sorting based on optional parameters, opposed to fetching the entire `chirps` table and sorting in memory, reducing network usage.

---

## 🌱 Future Plans

Ideas for how I could continue to extend this project beyond the base project:

- More to come

---

## 📄 Contributing

This repo is a personal project, so contributions aren’t actively sought — but if you have suggestions or fixes, feel free to open an issue or pull request 👍

---

## 📜 License

MIT License

---

## 👤 Author

[jeffschoe](https://github.com/jeffschoe)

---