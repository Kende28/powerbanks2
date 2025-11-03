import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
const port = 3000;

// Adatbázis-kapcsolat
const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'powerbank_db',
});

// Teszt útvonal
app.get("/", (req, res) => {
  res.send("Működik a szerver");
});

// ✅ Új /products endpoint az új táblához
app.get("/powerbanks", async (req, res) => {
  try {
    const [results] = await connection.query(
      `SELECT id, name, brand, battery_time, charge_duration, cost, available FROM powerbanks`
    );
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Nem sikerült lekérdezni a termékeket' });
  }
});

// ✅ Új termék felvétele
app.post("/powerbanks", async (req, res) => {
  const { name, brand, battery_time, charge_duration, cost, available } = req.body;

  // Egyszerű validáció
  if (!name || !brand || battery_time == null || charge_duration == null || cost == null) {
    return res.status(400).json({
      error: "Hiányzó kötelező mezők (name, brand, battery_time, charge_duration, cost)"
    });
  }

  try {
    const [result] = await connection.query(
      `INSERT INTO powerbanks (name, brand, battery_time, charge_duration, cost, available)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, brand, battery_time, charge_duration, cost, available ?? 1]
    );

    res.status(201).json({ message: "Termék hozzáadva", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Nem sikerült rögzíteni a terméket" });
  }
});

app.listen(port, () => {
  console.log(`A szerver működik a ${port} porton.`);
});