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

let sve_narudzbe = [];

app.post('/naruci1', (req, res) => {
    const narudzbe = req.body.narudzba;
    const detaljna_narudzba = req.body;

    if (!Array.isArray(narudzbe)) {
        return res.status(400).send('Neispravan format podataka. Očekuje se niz objekata.');
    };
    
    let keys;

    if (!detaljna_narudzba.prezime || !detaljna_narudzba.adresa || !detaljna_narudzba.broj_telefona) {
        return res.status(400).send('Niste poslali sve potrebne podatke o korisniku!');
    }

    let cijena_ukupno = 0;

    for (let element of narudzbe) {
        const keys = Object.keys(element);

        if (!(keys.includes('pizza') && keys.includes('velicina') && keys.includes('kolicina'))) {
            return res.status(400).send('Niste poslali sve potrebne podatke za narudžbu!');
        }

        const pizza_found = pizze.find(x => x.naziv === element.pizza);
        if (!pizza_found) {
            return res.status(400).send('Pizza ne postoji na našem jelovniku.');
        }

        cijena_ukupno += pizza_found.cijena * element.kolicina;
    }

    sve_narudzbe.push(narudzbe);

    // dobivamo listu stringova koji se sastoji od naziva pizze i veličine
    const pizze_naziv = narudzbe.map(x => `${x.pizza} (${x.velicina})`);

    res.json({
        message: `Vaša narudžba za ${pizze_naziv.join(', ')} je uspješno zaprimljena!`,
        prezime: detaljna_narudzba.prezime,
        adresa: detaljna_narudzba.adresa,
        ukupna_cijena: cijena_ukupno
     });
});

