let container = document.getElementById("mainCont");
let sort = document.getElementById("filterByPrice");
let category = document.getElementById("filterByCategory");
let searchInput = document.getElementById("searchInput");
let searchButton = document.getElementById("searchButton");
const API_URL = 'https://dummyjson.com/products';

let originalData = []; // To store the original dataset
let Cartarray = JSON.parse(localStorage.getItem("cart")) || []; // Initialize cart from localStorage
console.log("here is clothesh cart",Cartarray);


// Fetch Products from API
async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!data || !data.products) {
            alert('Failed to fetch products');
            return;
        }
        originalData = data.products; // Store original data once
        DisplayData(originalData);
    } catch (error) {
        console.error('Error fetching products:', error);
        alert('Error fetching products');
    }
}

// Display Products
function DisplayData(data) {
    container.innerHTML = "";

    if (data.length === 0) {
        container.innerHTML = "<p>No products found.</p>";
        return;
    }

    data.forEach((ele) => {
        let Cards = document.createElement("div");
        Cards.className = "product-card";

        let image = document.createElement("img");
        image.setAttribute("src", ele.thumbnail || ele.images[0]);
        image.setAttribute("alt", ele.title);

        let brandName = document.createElement("h4");
        brandName.innerText = (ele.brand || "Unknown Brand").toUpperCase();

        let details = document.createElement("p");
        details.innerText = ele.description;

        let price = document.createElement("h5");
        price.innerText = `Price: $${ele.price}`;

        // Add to Cart Button
        let addToCartBtn = document.createElement("button");
        addToCartBtn.innerText = "Add to Cart";
        addToCartBtn.addEventListener("click", () => {
            addToCart(ele);
        });

        let BtnDetails = document.createElement("button");
        BtnDetails.innerText = `View Details`;
        BtnDetails.addEventListener("click", () => {
            window.location.href = `product-details.html?id=${ele.id}`;
        });

        Cards.append(image, brandName, details, price, addToCartBtn, BtnDetails);
        container.append(Cards);
    });
}

// Add Product to Cart
function addToCart(product) {
    if (!Cartarray.some((item) => item.id === product.id)) {
        Cartarray.push(product);
        localStorage.setItem("cart", JSON.stringify(Cartarray));
        alert("Product added to cart!");
    } else {
        alert("Product already in cart.");
    }
}

// Search Functionality
searchButton.addEventListener("click", function () {
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm === "") {
        alert("Please enter a search term.");
        return;
    }
    const filteredData = originalData.filter(
        (product) =>
            (product.title?.toLowerCase() || "").includes(searchTerm) ||
            (product.brand?.toLowerCase() || "").includes(searchTerm)
    );
    DisplayData(filteredData);
});


// Sorting Functionality
sort.addEventListener("change", function () {
    let sortedData;

    if (sort.value === "L") {
        // Sort Low to High
        sortedData = [...originalData].sort((a, b) => a.price - b.price);
    } else if (sort.value === "H") {
        // Sort High to Low
        sortedData = [...originalData].sort((a, b) => b.price - a.price);
    } else {
        // Default: Original Order
        sortedData = originalData;
    }

    DisplayData(sortedData);
});

// Filtering by Category
category.addEventListener("change", function () {
    const categoryValue = category.value;
    if (categoryValue === "all") {
        // Show all products
        DisplayData(originalData);
    } else {
        // Filter products based on selected category
        const filteredData = originalData.filter(
            (product) => product.category === categoryValue
        );
        DisplayData(filteredData);
    }
});

// Fetch Products on Page Load
fetchProducts();
