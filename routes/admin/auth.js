const express = require('express');
const usersRepo = require('../../repositories/users');

const router = express.Router();

// root route
router.get('/signup', (req, res) => {
    res.send(`
        <div>
            Your id is: ${req.session.userId}
            <form method="POST">
                <input name="email" placeholder="email" />
                <input name="password" placeholder="password" />
                <input name="passwordConfirmation" placeholder="password confirmation" />
                <button>Sign Up</button>
            </form>
        </div>
    `);
});

router.post('/signup', async (req, res) => {
    // destructure keys from body
    const { email, password, passwordConfirmation} = req.body;

    const existingUser = await UsersRepo.getOneBy({ email });
    if(existingUser){
        return res.send('Email in use.');
    }

    if(password !== passwordConfirmation) {
        return res.send('Password and password confirmation do not match.');
    }

    // create a user in user repo to represent this person
    // attributes are shorthand for { email: email, password: password }
    const user = await UsersRepo.create({ email, password });
    // since we return the attrs on the create function inside users.js, we will now be able to access the id

    req.session.userId = user.id  // added by cookie-session, we are using "userId" to this object

    console.log(req.body);
    res.send('Account created');
});

router.get('/signout', (req, res) => {
    req.session = null;
    res.send('You are logged out.');
});

router.get('/signin', (req, res) => {
    res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email" />
                <input name="password" placeholder="password" />
                <button>Sign In</button>
            </form>
        </div>
    `)
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const user = await UsersRepo.getOneBy({ email });

    if(!user) {
        return res.send('Email not found.');
    }

    const validPassword = await UsersRepo.comparePasswords(
        user.password,
        password
    )

    if(!validPassword) {
        return res.send('Invalid password.');
    }

    req.session.userId = user.id;

    res.send('You are signed in.');
});

module.exports = router;