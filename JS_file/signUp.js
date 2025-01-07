const form = document.getElementById('userForm');
const messageDiv = document.getElementById('message');
let Data = JSON.parse(localStorage.getItem('form')) || [];

// Handle Form Submission
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Check if passwords match
    if (password !== confirmPassword) {
        messageDiv.textContent = "Passwords do not match!";
        messageDiv.className = "message error";
        return;
    }

    // Check if email already exists
    const emailExists = Data.some(user => user.email === email);
    if (emailExists) {
        messageDiv.textContent = "Email already exists! Please use another.";
        messageDiv.className = "message error";
        return;
    };
    setTimeout(() => {
        window.location.href = "signIn.html";
    }, 500);

    // Save to LocalStorage
    const userData = {
        name: name,
        email: email,
        password: password
    };

    Data.push(userData);
    localStorage.setItem('form', JSON.stringify(Data));

    messageDiv.textContent = "Registration Successful!";
    messageDiv.className = "message success";

    form.reset();
});

// Pre-fill Data if Available
window.addEventListener('DOMContentLoaded', () => {
    if (Data.length > 0) {
        const { name, email } = Data[0]; // Prefill with the first user (for demo purposes)
        document.getElementById('name').value = name;
        document.getElementById('email').value = email;
        messageDiv.textContent = "Data pre-filled from LocalStorage.";
        messageDiv.className = "message success";
    }
});
