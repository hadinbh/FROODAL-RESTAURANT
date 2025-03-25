document.addEventListener("DOMContentLoaded", function () {
    const usersList = document.getElementById("usersList");

    // Fetch users data from the server
    fetch("/users")
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Network response was not ok.");
        })
        .then(users => {
            // Display users in the usersList element
            users.forEach(user => {
                const listItem = document.createElement("li");
                listItem.textContent = `Username: ${user.username}, Full Name: ${user.fullName}, Phone Number: ${user.phoneNumber}, Address: ${user.address}`;
                usersList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error("Error fetching users:", error);
            // Handle errors (e.g., display a message to the user)
        });
});