const express = require('express');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ['ksh990fubs2244kfs']
}));

app.use(authRouter);

app.listen(3001, () => {
    console.log('listening');
});