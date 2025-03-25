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

    const urlParams = new URLSearchParams(window.location.search);
    const mealImage = document.getElementById("item-image");
    const mealName = document.getElementById("item-name-bold");
    const mealIngredients = document.getElementById("item-ingredients");
    const mealDesc = document.getElementById("item-description");

    const mealCalories = document.getElementById("item-calories");
    const totalPriceElement = document.getElementById("total-price");
    const quantityElement = document.getElementById("quantity");
    const decrementButton = document.getElementById("decrement");
    const incrementButton = document.getElementById("increment");
    const addToCartBtn = document.getElementById("addToCartBtn");
    const cartIcon2 = document.getElementById("cartIcon");

    // Retrieve values from the query parameters
    const imageUrl = urlParams.get("image");
    const name = urlParams.get("name");
    const description = urlParams.get("description");
    const ingredients = urlParams.get("ingredients");
    const calories = urlParams.get("calories");
    const priceParam = urlParams.get("price");
    const price = parseFloat(priceParam) || 0;


    // Populate content on the page
    mealImage.style.backgroundImage = 'url(' + imageUrl + ')';
    mealName.textContent = name;
    mealDesc.textContent = description;
    mealIngredients.textContent = `Ingredients : ${ingredients}`;
    mealCalories.textContent = `Calories : ${calories}`;
    totalPriceElement.textContent = `Price : $${price.toFixed(2)}`;

    let quantity = 1;
    let total = price;

    // Update quantity and total price
    const updateQuantityAndTotal = () => {
        quantityElement.innerText = quantity;
        total = price * quantity;
        totalPriceElement.textContent = `Total Price : $${total.toFixed(2)}`;
    };

    // Event listeners for quantity buttons
    decrementButton.addEventListener("click", () => {
        if (quantity > 1) {
            quantity--;
            updateQuantityAndTotal();
        }
    });

    incrementButton.addEventListener("click", () => {
        quantity++;
        updateQuantityAndTotal();
    });

    // Initial update
    updateQuantityAndTotal();


    // Add a click event listener to the "Add to Cart" button
    addToCartBtn.addEventListener("click", () => {

        const isUserSignedUp = checkUserSignup();
        console.log("Is user signed in?", isUserSignedUp);
        if (isUserSignedUp) {
            const mealId = urlParams.get("id");
            const mealName = urlParams.get("name");
            const mealPrice = price;
            // Update local storage with the new cart items, including quantity
            const existingCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
            const newItem = { productId: mealId, productName: mealName, price: mealPrice, quantity: quantity };
            const updatedCartItems = [...existingCartItems, newItem];
            localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

            // Send a POST request to the server to add the item to the cart
            fetch(`http://localhost:3000/add-to-cart/${mealId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: mealId,
                    productName: mealName,
                    price: mealPrice,
                }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    // Check if the response contains the expected message
                    if (data.message === 'Item added to the cart successfully') {
                        // Display a "complete" message
                        alert('Item added to the cart successfully');
                        // Optionally, you can redirect to the cart page after adding to the cart
                        window.location.href = 'cart.html';
                    } else {
                        console.error('Unexpected response:', data);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error adding item to the cart. Please try again.');
                });
        }
        else {
            const shouldRedirectToSignIn = confirm("You are not signed in. Do you want to sign in?");
            if (shouldRedirectToSignIn) {
                // Redirect to the signin page
                window.location.href = "signin.html";
            }
        }
    });

    //Cheking if user is signed in
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

});