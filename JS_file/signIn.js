const signinForm = document.getElementById('signinForm');
const messageDiv = document.getElementById('message');

signinForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Retrieve user data from localStorage
    let userlist = JSON.parse(localStorage.getItem("form")) || [];

    if (userlist.length > 0) {
        // Find user with matching email and password
        const validUser = userlist.find(user => user.email === email && user.password === password);

        if (validUser) {
            messageDiv.textContent = "Sign-In Successful! Redirecting...";
            messageDiv.className = "message success";

            // Redirect to a dashboard or home page
            setTimeout(() => {
                window.location.href = "Home.html";
            }, 1000);
        } else {
            messageDiv.textContent = "Invalid Email or Password!";
            messageDiv.className = "message error";
        }
    } else {
        messageDiv.textContent = "No users found. Please register first.";
        messageDiv.className = "message error";
    }
});
