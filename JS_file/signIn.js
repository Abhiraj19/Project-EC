const signinForm = document.getElementById('signinForm');
const messageDiv = document.getElementById('message');

signinForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        messageDiv.textContent = "Please fill out all fields.";
        messageDiv.className = "message error";
        return;
    }

    let userlist = JSON.parse(localStorage.getItem("form")) || [];

    if (userlist.length === 0) {
        messageDiv.textContent = "No users found. Please register first.";
        messageDiv.className = "message error";
        return;
    }

    const validUser = userlist.find(user => user.email === email && user.password === password);
    const admin = userlist.find(user => user.email === "admin@gmail.com" && user.password === "admin");

    if (admin) {
        messageDiv.textContent = "Admin Login Successful! Redirecting...";
        messageDiv.className = "message success";
        setTimeout(() => {
            window.location.href = "admin.html";
        }, 1000);
    } else if (validUser) {
        messageDiv.textContent = "Sign-In Successful! Redirecting...";
        messageDiv.className = "message success";
        setTimeout(() => {
            window.location.href = "Home.html";
        }, 1000);
    } else {
        messageDiv.textContent = "Invalid Email or Password!";
        messageDiv.className = "message error";
    }
});
