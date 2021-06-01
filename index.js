const express = require('express');
const UsersRepo = require('./repositories/users');

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

app.post('/', async (req, res) => {
    // destructure keys from body
    const { email, password, passwordConfirmation} = req.body;

    const existingUser = await UsersRepo.getOneBy({ email });
    if(existingUser){
        return res.send('Email in use.');
    }

    if(password !== passwordConfirmation) {
        return res.send('Password and password confirmation do not match.');
    }

    console.log(req.body);
    res.send('Account created');
});

// listen on port 3000
app.listen(3001, () => {
    console.log('listening');
});