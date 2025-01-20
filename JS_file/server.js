const express = require('express');
const app = express();
const PORT = 5000;

// Middleware to parse JSON requests
app.use(express.json());

// In-memory product list (replace with a database in production)
let products = [];

// Endpoint to add a product
app.post('/api/products', (req, res) => {
    const { name, price, description } = req.body;

    // Validate the input
    if (!name || !price || !description) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create a new product
    const product = {
        id: products.length + 1,
        name,
        price: parseFloat(price),
        description,
    };

    products.push(product);

    // Send success response
    res.status(201).json({
        message: 'Product added successfully!',
        product,
    });
});

// Endpoint to fetch all products (for admin dashboard)
app.get('/api/products', (req, res) => {
    res.status(200).json(products);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
