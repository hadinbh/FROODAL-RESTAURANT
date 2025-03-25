const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const usersFilePath = path.join(__dirname, '/public/users.json');
const cartFilePath = path.join(__dirname, 'cart.json'); // Assuming you have a separate file for storing cart data


app.use(express.json());
app.use(express.static('public'));

// GET request to retrieve all the data in the json file
app.post('/signup', (req, res) => {
    const { email, password, fullName, phoneNumber, address } = req.body;

    // Validate input fields
    if (!email || !password || !fullName || !phoneNumber || !address) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Read existing users data from the file (if any)
    let users = [];
    try {
        users = JSON.parse(fs.readFileSync(usersFilePath));
    } catch (error) {
        // File doesn't exist or is empty, no problem, users array is already initialized as empty
    }

    // Check if the email already exists
    if (users.some(user => user.email === email)) {
        return res.status(400).json({ error: 'Email already exists' });
    }

    // Add the new user to the users array
    users.push({ email, password, fullName, phoneNumber, address });

    // Save updated users data back to the file
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    // Send a simple success message
    res.json({ message: 'Sign up successful!' });
});

app.put("/account/:email", async (req, res) => {
    const { email, password, fullName, phoneNumber, address } = await req.body;
    if (!email || !password || !fullName || !phoneNumber || !address) {
      return res.status(400).json({ error: "All fields are required" });
    }
    let users = [];
    try {
      users = JSON.parse(fs.readFileSync(usersFilePath));
    } catch (error) {
      console.log(error);
      // File doesn't exist or is empty, no problem, users array is already initialized as empty
    }
    const targetEmail = users.find((user) => user.email === req.params.email);
    if (targetEmail) {
      targetEmail.email = email;
      targetEmail.password = password;
      targetEmail.fullName = fullName;
      targetEmail.phoneNumber = phoneNumber;
      targetEmail.address = address;
    }
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  
    // // Send a simple success message
  
    res.json({ message: "User Information Update Successful!" });
  });

app.post('/test', (req, res) => {
    console.log('Received test request with data:', req.body);
    res.json({ message: 'Test endpoint received data successfully!' });
});

app.post('/add-to-cart/:itemId', (req, res) => {
    const itemId = req.params.itemId;
    const { productId, productName, price } = req.body;

    // Read existing cart data from the file (if any)
    let cart = [];
    try {
        cart = JSON.parse(fs.readFileSync(cartFilePath));
    } catch (error) {
        // File doesn't exist or is empty, no problem, cart array is already initialized as empty
    }

    // Add the item to the cart
    cart.push({ itemId, productId, productName, price });

    // Save updated cart data back to the file
    fs.writeFileSync(cartFilePath, JSON.stringify(cart, null, 2));

    // Send a simple success message
    res.json({ message: 'Item added to the cart successfully' });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});