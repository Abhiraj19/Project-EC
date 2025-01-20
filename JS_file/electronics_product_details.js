const API_URL = 'https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-tech-products/';
const productDetailsContainer = document.getElementById('productDetails');
const relatedProductsContainer = document.getElementById('relatedProducts');

// Function to sanitize HTML to prevent XSS attacks
const sanitizeHTML = (str) => {
    const tempDiv = document.createElement('div');
    tempDiv.textContent = str;
    return tempDiv.innerHTML;
};

// Get Product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Fetch and Display Product Details
async function fetchProductDetails() {
    if (!productId) {
        productDetailsContainer.innerHTML = '<p>Product ID not found.</p>';
        return;
    }

    try {
        productDetailsContainer.innerHTML = '<p>Loading product details...</p>';
        const product = await fetchWithRetry(`${API_URL}${productId}`, 3);

        console.log("Product fetched:", product.data);

        displayProductDetails(product.data);
        fetchRelatedProducts(product.data.id);
    } catch (error) {
        console.error('Error fetching product details:', error);
        productDetailsContainer.innerHTML = '<p>Error fetching product details.</p>';
    }
}

// Display Product Details
function displayProductDetails(product) {
    const imageSrc = product.img || 'https://via.placeholder.com/150';
    productDetailsContainer.innerHTML = `
        <div class="product-detail-card">
            <img src="${imageSrc}" alt="${sanitizeHTML(product.brand)}">
            <h2><strong>Category:</strong> ${sanitizeHTML(product.category)}</h2>
            <p><strong>Brand:</strong> ${sanitizeHTML(product.brand)}</p>
            <p><strong>Description:</strong> ${sanitizeHTML(product.details)}</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <button onclick="addToCart({
                id: ${product.id}, 
                price: ${product.price}, 
                title: '${sanitizeHTML(product.title)}', 
                brand: '${sanitizeHTML(product.brand)}', 
                category: '${sanitizeHTML(product.category)}', 
                thumbnail: '${imageSrc}'
            })">Add to Cart</button>
        </div>
    `;
}

// Fetch and Display Related Products
async function fetchRelatedProducts(currentProductId) {
    try {
        relatedProductsContainer.innerHTML = '<p>Loading related products...</p>';
        const data = await fetchWithRetry(API_URL, 3);

        const relatedProducts = data.data.filter(product => product.id !== currentProductId);
        displayRelatedProducts(relatedProducts);
    } catch (error) {
        console.error('Error fetching related products:', error);
        relatedProductsContainer.innerHTML = '<p>Error fetching related products.</p>';
    }
}

// Display Related Products
function displayRelatedProducts(products) {
    relatedProductsContainer.innerHTML = products.length
        ? products.slice(0, 4).map(createProductCard).join("")
        : '<p>No related products found.</p>';
}

// Create Product Card
function createProductCard(product) {
    const imageSrc = product.img || product.thumbnail || (product.images && product.images[0]) || 'https://via.placeholder.com/150';
    return `
        <div class="related-product-card">
            <img src="${imageSrc}" alt="${sanitizeHTML(product.title)}">
            <h4>${sanitizeHTML(product.title)}</h4>
            <p>Price: $${product.price}</p>
            <button onclick="viewProduct(${product.id})">View Details</button>
        </div>
    `;
}

// Navigate to Product Details Page
function viewProduct(id) {
    if (!id) {
        alert("Invalid product ID!");
        return;
    }
    window.location.href = `electronics_product_details.html?id=${id}`;
}

// Add to Cart
function addToCart({ id, price, title, brand, thumbnail, category }) {
    const imageSrc = thumbnail || 'https://via.placeholder.com/150';
    let cartArray = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("Adding to cart:", { id, price, title, brand, category });

    if (!cartArray.some(item => item.id === id && item.brand === brand)) {
        cartArray.push({ id, quantity: 1, price, title, brand, category, image: imageSrc });
        localStorage.setItem("cart", JSON.stringify(cartArray));
        alert("Product added to cart!");
    } else {
        alert("Product already in cart!");
    }
}

// Retry Wrapper for Fetch
async function fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            if (i === retries - 1) throw error;
        }
    }
}

// Load Product Details
fetchProductDetails();
