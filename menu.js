'use strict';

document.addEventListener("DOMContentLoaded", () => {
    const storedUsername = sessionStorage.getItem("usersName");
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("usersName") || storedUsername;
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
    getMenu();


    function createElements() {
        const allMenuItems = localStorage.getItem("menuItems");
        const data = allMenuItems ? JSON.parse(allMenuItems) : [];

        let mainElementPizza = document.getElementById('pizza-div');
        let mainElementPasta = document.getElementById('pasta-div');

        data.forEach(function (item) {
            let col = document.createElement('div');
            col.className = 'col-md-4 text-center';

            let menuWrap = document.createElement('div');
            menuWrap.className = 'menu-wrap';

            let a = document.createElement('a');
            a.href = '#';
            a.className = 'menu-img img mb-4';
            a.style.backgroundImage = 'url(' + item.image + ')';
            a.addEventListener("click", () => {
                // Redirect to the meal details page with the necessary query parameters
                window.location.href = `mealdetails.html?id=${item.id}&image=${item.image}&name=${item.name}&description=${item.description}&ingredients=${item.ingredients}&calories=${item.calories}&price=${parseFloat(item.price.replace('$', ''))}`;
            });

            let div = document.createElement('div');
            div.className = 'text';

            let h3 = document.createElement('h3');
            let a2 = document.createElement('a');
            a2.textContent = item.name;

            let p2 = document.createElement('p');
            p2.className = 'price';
            let span = document.createElement('span');
            span.textContent = item.price;

            let p3 = document.createElement('p');
            let a3 = document.createElement('a');
            a3.className = 'btn btn-white btn-outline-white';
            a3.textContent = 'Add to cart';
            a3.addEventListener("click", () => {
                // Redirect to the meal details page with the necessary query parameters
                window.location.href = `mealdetails.html?id=${item.id}&image=${item.image}&name=${item.name}&description=${item.description}&ingredients=${item.ingredients}&calories=${item.calories}&price=${parseFloat(item.price.replace('$', ''))}`;
            });

            if (item.id > 14) {
                mainElementPizza.appendChild(col);
                col.appendChild(menuWrap);
                menuWrap.appendChild(a);
                menuWrap.appendChild(div);
                div.appendChild(h3);
                h3.appendChild(a2);
                div.appendChild(p2);
                p2.appendChild(span);
                div.appendChild(p3);
                p3.appendChild(a3);
            }
            else if (item.id < 14) {
                mainElementPasta.appendChild(col);
                col.appendChild(menuWrap);
                menuWrap.appendChild(a);
                menuWrap.appendChild(div);
                div.appendChild(h3);
                h3.appendChild(a2);
                div.appendChild(p2);
                p2.appendChild(span);
                div.appendChild(p3);
                p3.appendChild(a3);
            };
        });
    };

    async function getMenu() {
        const response = await fetch('menu.json');
        const data = await response.json();
        localStorage.setItem("menuItems", JSON.stringify(data));
        createElements();
        return data;
    };

});
