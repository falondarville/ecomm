const express = require('express');

const app = express();

// root route
app.get('/', (req, res) => {
    res.send('hi there!');
});

// listen on port 3000
app.listen(3000, () => {
    console.log('listening');
});