document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM Loaded");
    const greetingSignin = document.getElementById("signInNav");
    const logOutNav = document.getElementById("signUpNav");

    if (sessionStorage.getItem("userEmail")) {
        greetingSignin.textContent = `Hello, ${sessionStorage.getItem("usersName")}!`;
        greetingSignin.href = "account.html"
        logOutNav.textContent = "Log Out"

        logOutNav.href = "index.html";
    }
    else{
        greetingSignin.href = "signin.html"
    }

    logOutNav.addEventListener("click", () => {
        console.log("log out button clicked");
        for (let key in sessionStorage) {
            // removing each key from session storage
            sessionStorage.removeItem("usersName");
            sessionStorage.removeItem("userEmail");

        }
        // Redirect to the home page
        window.location.href = "index.html";
    });

    const signupForm = document.getElementById("signupForm");

    if (signupForm) {
        signupForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            console.log("Form Submitted");

            try {
                const email = document.getElementById("email").value;
                const password = document.getElementById("password").value;
                const fullName = document.getElementById("fullName").value;
                const phoneNumber = document.getElementById("phoneNumber").value;
                const address = document.getElementById("address").value;

                // Client-side validation
                if (!email || !password || !fullName || !phoneNumber || !address) {
                    throw new Error("Please fill in all the required fields.");
                }

                const userData = {
                    email: email, 
                    password: password,
                    fullName: fullName,
                    phoneNumber: phoneNumber,
                    address: address
                };

                console.log("Sending data:", userData);

                const response = await fetch("/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(userData)
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));

                    if (errorData.error === 'Username already exists') {
                        throw new Error('This username is already taken. Please choose another one.');
                    } else {
                        throw new Error(`Server responded with status ${response.status}: ${response.statusText}. ${errorData.error}`);
                    }
                }

                const data = await response.json().catch(() => ({}));

                // Check for the existence of a token more explicitly
                if (data.token) {
                    document.cookie = `sessionToken=${data.token}; expires=Wed, 1 Jan 2025 12:00:00 UTC; path=/;`;
                    // You might want to perform additional actions with the token here
                } else {
                    console.log("No token received from the server.");
                }

                console.log("Server Response:", response);
                console.log("Data received from server:", data);
                displayConfirmation(data.message);
            } catch (error) {
                console.error("Error:", error.message);
                alert(error.message); // Display user-friendly error message
            }
        });
    }

    function displayConfirmation(message) {
        console.log("Confirmation Message:", message);
        alert(message);
        window.location.href = "/index.html"; // Redirect to the appropriate page
    }
});