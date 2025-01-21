// Get references to DOM elements
const cartItemsContainer = document.getElementById("cart-items");
const priceItemsElement = document.getElementById("price-items");
const discountElement = document.getElementById("discount");
const totalPriceElement = document.getElementById("total-price");
const clearCartButton = document.getElementById("clear-cart-btn");
const checkoutButton = document.getElementById("checkout-btn");

// Initialize Cart from localStorage or empty array
let Cartarray = JSON.parse(localStorage.getItem("cart")) || [];
console.log(Cartarray);


// Discount percentage (you can customize this value)
const DISCOUNT_PERCENTAGE = 0.2; // 20%

// Function to calculate totals
function calculateTotals() {
    let totalPrice = 0;
    let totalDiscount = 0;

    Cartarray.forEach((item) => {
        const itemTotal = item.price * (item.quantity || 1);
        totalPrice += itemTotal;
        totalDiscount += itemTotal * DISCOUNT_PERCENTAGE; // Apply discount
    });

    return {
        totalPrice,
        totalDiscount,
        finalAmount: totalPrice - totalDiscount,
    };
}

// Function to render cart items dynamically
function renderCart() {
    cartItemsContainer.innerHTML = ""; // Clear existing items

    if (Cartarray.length === 0) {
        cartItemsContainer.innerHTML = "<tr><td colspan='5'>Your cart is empty.</td></tr>";
        priceItemsElement.textContent = "$0";
        discountElement.textContent = "-$0";
        totalPriceElement.textContent = "$0";
    } else {
        Cartarray.forEach((item, index) => {
            const row = document.createElement("tr");

            // Handle missing image paths gracefully
            const imageSrc =item.img|| item.thumbnail || item.image || "https://via.placeholder.com/150"; // Fallback to a default image

            row.innerHTML = `
                <td>
                    <img src="${imageSrc}" alt="${item.title}" class="cart-image"> 
                    <span>${item.brand||item.brand}</span> 
                     <span>${item.title||item.category}</span>
                </td>
                <td>
                    <button class="quantity-btn" data-index="${index}" data-action="decrease">-</button>
                    <span class="quantity-value">${item.quantity || 1}</span>
                    <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
                </td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${(item.price * (item.quantity || 1)).toFixed(2)}</td>
                <td>
                    <button class="remove-btn" data-index="${index}">Remove</button>
                </td>
            `;
            cartItemsContainer.appendChild(row);
        });

        // Update totals
        const { totalPrice, totalDiscount, finalAmount } = calculateTotals();
        priceItemsElement.textContent = `$${totalPrice.toFixed(2)}`;
        discountElement.textContent = `-$${totalDiscount.toFixed(2)}`;
        totalPriceElement.textContent = `$${finalAmount.toFixed(2)}`;
    }
}

// Function to remove item from the cart
function removeItem(index) {
    Cartarray.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(Cartarray));
    renderCart();
}

// Function to handle quantity change
function updateQuantity(index, quantity) {
    Cartarray[index].quantity = quantity; // Update the quantity of the item
    localStorage.setItem("cart", JSON.stringify(Cartarray)); // Save updated cart to localStorage
    renderCart();
}

// Event listeners
cartItemsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-btn")) {
        const index = event.target.getAttribute("data-index");
        removeItem(index);
    }

    if (event.target.classList.contains("quantity-btn")) {
        const index = event.target.getAttribute("data-index");
        const action = event.target.getAttribute("data-action");
        let quantity = Cartarray[index].quantity || 1;

        // Adjust quantity based on button clicked
        if (action === "increase") {
            quantity += 1;
        } else if (action === "decrease" && quantity > 1) {
            quantity -= 1;
        }

        updateQuantity(index, quantity);
    }
});

// Clear Cart Button Functionality
clearCartButton.addEventListener("click", () => {
    Cartarray = [];
    localStorage.setItem("cart", JSON.stringify(Cartarray));
    renderCart();
});

// Checkout Button Functionality
checkoutButton.addEventListener("click", () => {
    if (Cartarray.length > 0) {
        alert("Proceeding to checkout...");
        // Redirect to checkout page or open modal for checkout process
        window.location.href = "payment.html";
    } else {
        alert("Your cart is empty. Add items before proceeding.");
    }
});

// Initial render of cart items
renderCart();
