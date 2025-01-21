const API_URL = 'https://dummyjson.com/products/';
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

        displayProductDetails(product);
        fetchRelatedProducts(product.id);
    } catch (error) {
        console.error('Error fetching product details:', error);
        productDetailsContainer.innerHTML = '<p>Error fetching product details.</p>';
    }
}

// Display Product Details
function displayProductDetails(product) {
    const imageSrc = product.thumbnail || (product.images && product.images[0]) || 'https://via.placeholder.com/150';
    productDetailsContainer.innerHTML = `
        <div class="product-detail-card">
            <img src="${imageSrc}" alt="${sanitizeHTML(product.title)}">
            <h2>${sanitizeHTML(product.title)}</h2>
            <p><strong>Brand:</strong> ${sanitizeHTML(product.brand)}</p>
            <p><strong>Description:</strong> ${sanitizeHTML(product.description)}</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <button id="epcrd" onclick="addToCart({
                id: ${product.id}, 
                price: ${product.price}, 
                title: '${sanitizeHTML(product.title)}', 
                brand: '${sanitizeHTML(product.brand)}',  // Pass the brand explicitly
                thumbnail: '${imageSrc}'
            })">Add to Cart</button>
        </div>
    `;
}

// Fetch and Display Related Products
async function fetchRelatedProducts(currentProductId) {
    try {
        relatedProductsContainer.innerHTML = '<p>Loading related products...</p>';
        const data = await fetchWithRetry(`${API_URL}`, 3);

        const relatedProducts = data.products.filter(product => product.id != currentProductId);
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
    const imageSrc = product.thumbnail || (product.images && product.images[0]) || 'https://via.placeholder.com/150';
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
    window.location.href = `product-details.html?id=${id}`;
}

// Add to Cart
function addToCart({ id, price, title, brand, thumbnail }) {
    const imageSrc = thumbnail || 'https://via.placeholder.com/150';
    let cartArray = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("Adding to cart:", { id, price, title, brand });

    if (!cartArray.some(item => item.id === id && item.brand === brand)) {
        cartArray.push({ id, quantity: 1, price, title, brand, image: imageSrc });
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


let userlist = JSON.parse(localStorage.getItem("form"))||[]
console.log("userlist is here",userlist);


// let username = document.querySelector("#signin>a")



// let userbtn = document.querySelector("#signin>img")



let cartbtn = document.getElementById("cart")

cartbtn.addEventListener("click",()=>{
    if(userlist.length>0){
     window.location.href = "Cart.html"
    }else{
        alert("Please Login First")
        window.location.href = "signin.html"
    }
    
})

// Load Product Details
fetchProductDetails();
