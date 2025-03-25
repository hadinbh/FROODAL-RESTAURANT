'use strict';

document.addEventListener("DOMContentLoaded", async function () {
    //Nav Bar Sign in / Sign up Changes 
    const greetingSignin = document.getElementById("signInNav");
    const logOutNav = document.getElementById("signUpNav");

    if (sessionStorage.getItem("userEmail")) {
        greetingSignin.textContent = `Hello, ${sessionStorage.getItem("usersName")}!`;
        greetingSignin.href = "account.html"
        logOutNav.textContent = "Log Out"

        logOutNav.href = "index.html";
    }
    else {
        greetingSignin.href = "signin.html"
    }
    logOutNav.addEventListener("click", () => {
        for (let key in sessionStorage) {
            // removing each key from session storage
            sessionStorage.removeItem("usersName");
            sessionStorage.removeItem("userEmail");
        };
        // Redirect to the home page
        window.location.href = "index.html";
    });
    ///END OF NAV BAR CODE.

    // Fetch user data from the server or local storage
    const usersData = await fetchUsersData(); // Implement this function
    const user = usersData.find(user => user.email === sessionStorage.getItem("userEmail") && user.fullName === sessionStorage.getItem("usersName"));
    accFormFillUser(user);

    //Fill in the data for the user
    const accountForm = document.getElementById("accountForm");

    const saveChangesBtn = document.getElementById("saveChangesBtn");
    saveChangesBtn.addEventListener("click", accformSubmit);
});

// Fill in the account form with the user's data
function accFormFillUser(user) {
    document.getElementById("name").value = user.fullName;
    document.getElementById("email").value = user.email;
    document.getElementById("phone").value = user.phoneNumber;
    document.getElementById("address").value = user.address;
    document.getElementById("password").value = user.password;
};

// Save the changes the user made to their account
function accformSubmit() {
    // Create a new user object with the updated information
    if (accountForm) {
        accountForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            try {
                // Get the form data
                const email = document.getElementById("email").value;
                const password = document.getElementById("password").value;
                const fullName = document.getElementById("name").value;
                const phoneNumber = document.getElementById("phone").value;
                const address = document.getElementById("address").value;

                // console.log(email, password, fullName, phoneNumber, address);
                // Basic client-side validation
                if (!email || !password || !fullName || !phoneNumber || !address) {
                    throw new Error("Please fill in all the required fields.");
                }

                const userDataUpdated = {
                    email: email, // Change this to match the server's expected key for email
                    password: password,
                    fullName: fullName,
                    phoneNumber: phoneNumber,
                    address: address
                };

                // console.log("Sending data:", userDataUpdated);

                const response = await fetch(`/account/${userDataUpdated.email}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(userDataUpdated)
                });

                if (response.ok) {
                    const data = await response.json().catch(() => ({}));
                    // Check for the existence of a token more explicitly
                    if (data.token) {
                        document.cookie = `sessionToken=${data.token}; expires=Wed, 1 Jan 2025 12:00:00 UTC; path=/;`;
                    } else {
                        console.log("No token received from the server.");
                    }
                    displayConfirmation(data.message);

                }

            } catch (error) {
                alert(error.message); // Display user-friendly error message
            }
        })
    }
};

// Display a confirmation message to the user
function displayConfirmation(message) {
    // console.log("Confirmation Message:", message);
    alert(message);
    //need to fire the logout btn and redirect to update account data in session
    alert("logging Out to save changes , please sign in again.!");
    //Logging out the account
    for (let key in sessionStorage) {
        // removing each key from session storage
        sessionStorage.removeItem("usersName");
        sessionStorage.removeItem("userEmail");
    };

    window.location.href = "signin.html"; // Redirect to the appropriate page
};

// Function to fetch users data
async function fetchUsersData() {
    const url = "/users.json";
    const response = await fetch(url);
    if (response.ok) {
        return await response.json();
    } else {
        throw new Error("Failed to fetch users data.");
    }
};
