document.addEventListener("DOMContentLoaded", function () {
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

        }
        // Redirect to the home page
        window.location.href = "index.html";
    });
    const paymentForm = document.getElementById("paymentForm");
    const creditCardDetails = document.getElementById("creditCardDetails");
    const proceedButton = document.getElementById("proceedButton");

    paymentForm.addEventListener("change", function () {
        // Check the selected payment method
        const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

        // Show or hide the credit card details section based on the selected payment method
        creditCardDetails.style.display = selectedPaymentMethod === 'creditCard' ? 'block' : 'none';
    });

    proceedButton.addEventListener("click", function () {
        // Check the selected payment method
        const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

        // Redirect based on the selected payment method
        if (selectedPaymentMethod === 'cashOnDelivery') {
            alert(`Your order has been placed successfully and will be delivered within 45 mins max !.`);
            window.location.href = "index.html";
        } else {
            if (!document.getElementById("cardNumber").value || !document.getElementById("expirationDate").value || !document.getElementById("cvv").value) {
                alert("please fill the form fields ..!")
            }
            else {
                alert(`Your order has been placed successfully and will be delivered within 45 mins max !.`);
                window.location.href = "index.html";
            }

        }
    });
});
