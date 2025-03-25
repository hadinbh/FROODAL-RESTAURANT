document.addEventListener("DOMContentLoaded", () => {
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
        console.log("log out button clicked");
        for (let key in sessionStorage) {
            // removing each key from session storage
            sessionStorage.removeItem("usersName");
            sessionStorage.removeItem("userEmail");
        };
        // Redirect to the home page
        window.location.href = "index.html";
    });

});
