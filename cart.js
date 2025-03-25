'use strict';

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

        }
        // Redirect to the home page
        window.location.href = "index.html";
    });

    const storedUsername = sessionStorage.getItem("usersName");

    if (storedUsername) {
        const cartItems = getCartItems();

        if (cartItems) {
            displayCartItems(cartItems);
            updateTotalPrice(cartItems);
        }
        else {
            alert("Cart is Empty ..!");
        }

        function displayCartItems(items) {
            const cartItemsContainer = document.getElementById("cart-items");
            cartItemsContainer.innerHTML = "";
            const totalCheckoutDiv = document.getElementById("totalCheckoutDiv");
            totalCheckoutDiv.innerHTML = "";

            let itemsQuantity = 0;

            if (cartItemsContainer) {
                let cartTotal = document.createElement('p');
                cartTotal.id = "cart-total";
                totalCheckoutDiv.appendChild(cartTotal);

                let cartTotalBtn = document.createElement('button');
                cartTotalBtn.id = "checkoutBtn";
                cartTotalBtn.className = "btn btn-white btn-outline-white";
                cartTotalBtn.textContent = "Check Out (" + items.length + ")";
                totalCheckoutDiv.appendChild(cartTotalBtn);

                const checkoutBtn = document.getElementById("checkoutBtn");
                checkoutBtn.addEventListener("click", handleCheckout);
            }

            // For each entry in the data array, create the HTML tags
            items.forEach(function (entry) {
                // to get full data for the item in the cart object from the menu object .
                itemsQuantity = entry.quantity;

                let itemstotPrice = itemsQuantity * entry.price;

                entry = filterById(parseInt(entry.productId));

                let pricingEntry = document.createElement('div');
                pricingEntry.className = 'pricing-entry d-flex ftco-animate fadeInUp ftco-animated';
                cartItemsContainer.appendChild(pricingEntry);

                let imgDiv = document.createElement('div');
                imgDiv.className = 'img';
                imgDiv.style.backgroundImage = `url(${entry.image})`;
                pricingEntry.appendChild(imgDiv);


                let descDiv = document.createElement('div');
                descDiv.className = 'desc pl-3';
                pricingEntry.appendChild(descDiv);

                let dFlexText = document.createElement('div');
                dFlexText.className = 'd-flex text align-items-center';
                descDiv.appendChild(dFlexText);

                let h3 = document.createElement('h3');
                h3.innerHTML = `<span>${entry.name}</span>` + `<span>${itemsQuantity}</span>`;
                dFlexText.appendChild(h3);

                let spanPrice = document.createElement('span');
                spanPrice.className = 'price';
                spanPrice.innerHTML = `${'$' + itemstotPrice}`;
                dFlexText.appendChild(spanPrice);

                let removeButton = document.createElement('button');
                removeButton.className = 'btn btn-white btn-outline-white'
                removeButton.innerHTML = "Delete";
                removeButton.dataset.productId = entry.id;
                removeButton.addEventListener("click", handleDelete);
                descDiv.appendChild(removeButton);
            });
        }

        function updateTotalPrice(items) {
            const totalPriceElement = document.getElementById("cart-total");

            const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

            totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
        }

        function getCartItems() {
            const allCartItems = localStorage.getItem("cartItems");
            return allCartItems ? JSON.parse(allCartItems) : [];
        }

        function filterById(id) {
            let data = localStorage.getItem('menuItems');

            if (!data) {
                return null;
            }

            let jsonData = JSON.parse(data);

            let filteredData = jsonData.filter(function (item) {
                return item.id === id;
            });

            if (filteredData.length > 0) {
                return filteredData[0];
            }

            return null;
        }

        function handleCheckout() {
            const isUserSignedUp = checkUserSignup();
            if (!isUserSignedUp) {
                // Display a confirmation dialog
                console.log(isUserSignedUp);
                const shouldRedirectToSignIn = confirm("You are not signed in. Do you want to sign in?");
                if (shouldRedirectToSignIn) {
                    // Redirect to the signin page
                    window.location.href = "signin.html";
                }
            } else {
                const cartItemschekout = getCartItems();
                if (cartItemschekout[0]) {
                    // User is signed in, proceed with checkout logic
                    var txt;
                    if (confirm("Are you Sure You need to Complete Your Order?")) {
                        // Delete Cart before redirect to menu (Checkout successfull)
                        const updatedCartItems = '';
                        // Clean cart items to local storage
                        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
                        window.location.href = 'payment.html'
                    } else {
                        txt = "Ordered Calceled!";
                    }
                    document.getElementById("demo").innerHTML = txt;
                }
                else {
                    alert("Cart is Empty ..!");
                    console.log("Cart is Empty ..!");
                }
            }
        }

        function checkUserSignup() {
            try {
                const userEmail = sessionStorage.getItem("userEmail");
                return userEmail !== null && userEmail !== undefined;
            } catch (error) {
                console.error("Error checking user signup:", error.message);
                console.log(error);
                return false;
            }
        }

        function handleDelete(event) {
            const productIdToDelete = event.target.dataset.productId;

            // Retrieve cart items from local storage
            const cartItems = getCartItems();

            // Filter out the item to be deleted
            const updatedCartItems = cartItems.filter(item => item.productId !== productIdToDelete);

            // Save the updated cart items to local storage
            localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

            // Refresh the displayed cart items and total price
            displayCartItems(updatedCartItems);
            updateTotalPrice(updatedCartItems);
        }

    }
    else {
        alert("You are not signed in. Do you want to sign in?");
        window.location.href = "signin.html";
    }
});