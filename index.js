const express = require("express");
const app = express();
const path = require("path");
const PORT = 3000;
app.listen(PORT, (error) => {
    if (error) {
    console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
    } else {
    console.log(`Server je pokrenut na http://localhost:${PORT}`);
    }
    });

// 1. GET ruta koja vraća HTML stranicu "Hello, Express!"
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 2. GET ruta /about koja vraca HTML stranicu "Ovo je stranica o nama!"
app.get("/about", function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

// 3. GET ruta /users koja vraca korisnike u JSON formatu
app.get("/users", function (req, res) {
    const users = [
        { id: 1, ime: "Ana", prezime: "Anić"},
        { id: 2, ime: "Pero", prezime: "Perić"},
        { id: 3, ime: "Ivo", prezime: "Ivić"}
    ];
    res.json(users);
});

