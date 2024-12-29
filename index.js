const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Inisialisasi aplikasi Express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Inisialisasi database SQLite
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to SQLite database.');
});

// Membuat tabel users jika belum ada
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullname TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        whatsapp TEXT NOT NULL,
        password TEXT NOT NULL
    )
`);

// Route untuk halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route untuk pendaftaran
app.post('/register', (req, res) => {
    const { fullname, username, whatsapp, password } = req.body;

    // Validasi input kosong
    if (!fullname || !username || !whatsapp || !password) {
        return res.send('All fields are required. <a href="/auth/register.html">Try again</a>');
    }

    // Masukkan data ke database
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
            res.redirect('/auth/login.html?message=registered');
        }
    });
});

// Route untuk login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Validasi input kosong
    if (!username || !password) {
        return res.send('All fields are required. <a href="/auth/login.html">Try again</a>');
    }

    // Periksa data di database
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    db.get(query, [username, password], (err, row) => {
        if (err) {
            console.error(err.message);
            res.send('An error occurred. Please try again.');
        } else if (row) {
            res.redirect('/dashboard.html');
        } else {
            res.send('Invalid username or password. <a href="/auth/login.html">Try again</a>');
        }
    });
});

// Route untuk halaman login dengan pesan sukses pendaftaran
app.get('/auth/login.html', (req, res) => {
    const message = req.query.message;
    let successMessage = '';
    if (message === 'registered') {
        successMessage = '<p>Registration successful! Please login.</p>';
    }

    // Kirim halaman login dengan pesan sukses
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login</title>
        </head>
        <body>
            <h1>Login</h1>
            ${successMessage}
            <form method="POST" action="/login">
                <input type="text" name="username" placeholder="Username" required><br>
                <input type="password" name="password" placeholder="Password" required><br>
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="/auth/register.html">Register</a></p>
        </body>
        </html>
    `);
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Inisialisasi aplikasi Express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Inisialisasi database SQLite
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to SQLite database.');
});

// Membuat tabel users jika belum ada
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullname TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        whatsapp TEXT NOT NULL,
        password TEXT NOT NULL
    )
`);

// Route untuk halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route untuk pendaftaran
app.post('/register', (req, res) => {
    const { fullname, username, whatsapp, password } = req.body;

    // Validasi input kosong
    if (!fullname || !username || !whatsapp || !password) {
        return res.send('All fields are required. <a href="/auth/register.html">Try again</a>');
    }

    // Masukkan data ke database
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
            res.redirect('/auth/login.html?message=registered');
        }
    });
});

// Route untuk login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Validasi input kosong
    if (!username || !password) {
        return res.send('All fields are required. <a href="/auth/login.html">Try again</a>');
    }

    // Periksa data di database
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    db.get(query, [username, password], (err, row) => {
        if (err) {
            console.error(err.message);
            res.send('An error occurred. Please try again.');
        } else if (row) {
            res.redirect('/dashboard.html');
        } else {
            res.send('Invalid username or password. <a href="/auth/login.html">Try again</a>');
        }
    });
});

// Route untuk halaman login dengan pesan sukses pendaftaran
app.get('/auth/login.html', (req, res) => {
    const message = req.query.message;
    let successMessage = '';
    if (message === 'registered') {
        successMessage = '<p>Registration successful! Please login.</p>';
    }

    // Kirim halaman login dengan pesan sukses
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login</title>
        </head>
        <body>
            <h1>Login</h1>
            ${successMessage}
            <form method="POST" action="/login">
                <input type="text" name="username" placeholder="Username" required><br>
                <input type="password" name="password" placeholder="Password" required><br>
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="/auth/register.html">Register</a></p>
        </body>
        </html>
    `);
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    
