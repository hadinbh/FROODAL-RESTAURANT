document.addEventListener("DOMContentLoaded", function () {
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
        for (let key in sessionStorage) {
            // removing each key from session storage
            sessionStorage.removeItem("usersName");
            sessionStorage.removeItem("userEmail");

        }
        // Redirect to the home page
        window.location.href = "index.html";
    });

    const signinForm = document.getElementById("signinForm");

    if (signinForm) {
        signinForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            try {
                const email = document.getElementById("email").value;
                const password = document.getElementById("password").value;

                // Basic client-side validation
                if (!email || !password) {
                    throw new Error("Please fill in all the required fields.");
                }

                // Fetch user data from the server or local storage
                const usersData = await fetchUsersData(); // Implement this function

                // Verify user credentials
                const authenticatedUser = verifyUserCredentials(usersData, email, password);

                if (authenticatedUser) {
                    // Successful sign-in

                    // Store user email in sessionStorage
                    sessionStorage.setItem("userEmail", email);
                    sessionStorage.setItem("usersName", authenticatedUser["fullName"]);


                    // Redirect to another page on successful sign-in
                    window.location.href = "/menu.html"; // Change this to your desired page
                } else {
                    // Failed sign-in
                    throw new Error("Invalid email or password.");
                }

            } catch (error) {
                console.error("Error:", error.message);
                alert(error.message); // Display user-friendly error message
            }
        });
    }

    // Function to fetch users data
    async function fetchUsersData() {
        const url = "users.json";

        const response = await fetch(url);
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error("Failed to fetch users data.");
        }
    }

    // Function to verify user credentials
    function verifyUserCredentials(usersData, email, password) {
        user = usersData.find(user => user.email === email && user.password === password);
        return user
    }

});