const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Setup aplikasi
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Setup database
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the SQLite database.');
});

// Buat tabel jika belum ada
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullname TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        whatsapp TEXT NOT NULL,
        password TEXT NOT NULL
    )
`);

// Endpoint register
app.post('/register', (req, res) => {
    const { fullname, username, whatsapp, password } = req.body;
    const query = `INSERT INTO users (fullname, username, whatsapp, password) VALUES (?, ?, ?, ?)`;
    db.run(query, [fullname, username, whatsapp, password], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE')) {
                res.send('Username already exists. <a href="/auth/register.html">Try again</a>');
            } else {
                console.error(err.message);
                res.send('An error occurred. Please try again.');
            }
        } else {
            res.send('Registration successful! <a href="/auth/login.html">Login here</a>');
        }
    });
});

// Endpoint login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    db.get(query, [username, password], (err, row) => {
        if (err) {
            console.error(err.message);
            res.send('An error occurred. Please try again.');
        } else if (row) {
            res.redirect('/dashboard.html');
        } else {
            res.send('Invalid credentials. <a href="/auth/login.html">Try again</a>');
        }
    });
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
