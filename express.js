const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/signup', (req, res) => {
    const { username, password, fullName, phoneNumber, address } = req.body;

    if (!username || !password || !fullName || !phoneNumber || !address) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Your signup logic here...

    // Assuming success, send a response
    res.json({ message: 'Signup successful' });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});