const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (email === "test@example.com" && password === "password") {
        res.redirect('/dashboard.html');
    } else {
        res.send('Invalid credentials. <a href="/auth/login.html">Try again</a>');
    }
});

app.post('/register', (req, res) => {
    res.send('Registration successful. <a href="/auth/login.html">Login here</a>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
