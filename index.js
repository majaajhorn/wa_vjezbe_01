const express = require("express");
const app = express();
const path = require("path");

const PORT = 3000;

app.use(express.json());
app.listen(PORT, (error) => {
    if(error) {
        console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
    } else {
        console.log(`Server je pokrenut na http://localhost:${PORT}`);
    }
})

/*
app.get("/", function (req, res) {
    res.send("Hello, world!");
});
*/
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/about", function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'about.html'))
})

app.get("/users", function(req, res) {
    const users = [
        { id: 1, ime: "Ana", prezime: "Anić"},
        { id: 2, ime: "Ivan", prezime: "Ivić"},
        { id: 3, ime: "Pero", prezime: "Perić"},
    ];
    res.json(users);
});

// VJEŽBE 3 

/*app.get('/pizze', (req, res) => {
    res.send('Ovdje su sve dostupne pizze!');
});*/

const pizze = [
    { id: 1, naziv: 'Margherita', cijena: 6.5 },
    { id: 2, naziv: 'Capricciosa', cijena: 8.0 },
    { id: 3, naziv: 'Quattro formaggi', cijena: 10.0 },
    { id: 4, naziv: 'Šunka sir', cijena: 7.0 },
    { id: 5, naziv: 'Vegetariana', cijena: 9.0 },
];

// Ruta za vraćanje svih pizze
app.get('/pizze', (req, res) => {
    res.json(pizze); // Vraća sve pizze u JSON formatu
});

app.get('/pizze/:id', (req, res) => {
    const id_pizza = req.params.id; // dohvaća id parametar iz URL-a
    
    if (isNaN(id_pizza)) {
        res.json({ message: 'Proslijedili ste parametar id koji nije broj!' });
        return;
    }

    const pizza = pizze.find(pizza => pizza.id == id_pizza);

    if (pizza) {
        res.json(pizza);
    } else {
        res.json({ message: 'Pizza s traženim ID-em ne postoji.' });
    }
});

// POST METODA

/*
app.post('/naruci', (req, res) => {
    const narudzba = req.body;
    const kljucevi = Object.keys(narudzba);

    if (!(kljucevi.includes('pizza') && kljucevi.includes('velicina'))) {
        res.send('Niste poslali sve potrebne podatke za narudžbu!');
        return;
    }
    
    res.send(`Vaša narudžba za ${narudzba.pizza} (${narudzba.velicina}) je uspješno zaprimljena!`);
});
*/

// Vježba 1 i 2 - Naručivanje više pizze, Vježba 2 - Zanima nas i adresa dostave

let narudzbe = [];

// POST rutu za naručivanje
app.post('/naruci', (req, res) => {
    const narudzbeInput = req.body; // podaci o narudžbama
    const lista = [];
    let ukupnaCijena = 0; // Definiraj ukupnaCijena

    // Provjeravaj da li je narudzba niz
    if (!Array.isArray(narudzbeInput.narudzba)) {
        return res.status(400).send('Neispravan format podataka. Očekuje se niz objekata.');
    }

    // Provjera podataka o korisniku
    if (!narudzbeInput.prezime || !narudzbeInput.adresa || !narudzbeInput.broj_telefona) {
        return res.status(400).send('Niste poslali sve potrebne podatke o korisniku!');
    }

    for (let narudzba of narudzbeInput.narudzba) { // Promeni narudzbeInput na narudzbeInput.narudzba
        const kljucevi = Object.keys(narudzba);

        // Provjeri sve potrebne ključeve
        if (!(kljucevi.includes('pizza') && kljucevi.includes('velicina') && kljucevi.includes('kolicina'))) {
            return res.status(400).send('Niste poslali sve potrebne podatke za narudžbu!');
        }

        // Provjeri da li pizza postoji
        const postoji = pizze.find(p => p.naziv === narudzba.pizza);
        if (!postoji) {
            return res.status(400).send(`Pizza "${narudzba.pizza}" ne postoji na jelovniku.`);
        }

        // Izračunaj ukupnu cijenu
        ukupnaCijena += postoji.cijena * narudzba.kolicina;
        lista.push(`${narudzba.kolicina} x ${narudzba.pizza} (${narudzba.velicina})`);
    }

    // Spremi narudžbu u in-memory varijablu
    narudzbe.push({ 
        narudzba: lista, 
        ukupnaCijena,
        prezime: narudzbeInput.prezime,
        adresa: narudzbeInput.adresa,
        broj_telefona: narudzbeInput.broj_telefona
    });
    
    // Vratite odgovor korisniku
    res.json({ // koristi res.json() da pošalješ JSON
        narudzba: lista,
        prezime: narudzbeInput.prezime,
        adresa: narudzbeInput.adresa,
        broj_telefona: narudzbeInput.broj_telefona,
        message: `Vaša narudžba za ${lista.join(', ')} je uspješno zaprimljena!`,
        ukupna_cijena: ukupnaCijena.toFixed(2)
    });
});