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

app.delete("/powerbanks/:id", async (req, res) => {
  const { id } = req.params;
  try {
        const [result] = await connection.query(
            "DELETE FROM powerbanks WHERE id = ?",
            [id]
        );
 
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "A megadott ID-jű powerbank nem található." });
        }
 
        res.json({ message: "Powerbank sikeresen törölve." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Hiba történt a törlés során." });
    }
})

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
      [name, brand, battery_time, charge_duration, cost, available]
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