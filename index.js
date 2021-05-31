const express = require('express');

const app = express();

// Middleware: parse form body 
app.use(express.urlencoded({ extended: true }));

// root route
app.get('/', (req, res) => {
    res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email" />
                <input name="password" placeholder="password" />
                <input name="passwordConfirmation" placeholder="password confirmation" />
                <button>Sign Up</button>
            </form>
        </div>
    `);
});

app.post('/', (req, res) => {
    console.log(req.body);
    res.send('Account created');
});

// listen on port 3000
app.listen(3000, () => {
    console.log('listening');
});