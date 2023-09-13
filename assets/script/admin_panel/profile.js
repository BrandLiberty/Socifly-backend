// Get the modal and buttons
var modal = document.getElementById("confirmationModal");
var cancelButton = document.getElementById("cancelButton");
var confirmButton = document.getElementById("confirmButton");

// Add click event listeners to your buttons
var unverifyButton = document.querySelector(".unverify-button");
var deleteButton = document.querySelector(".delete-button");
var banButton = document.querySelector(".ban-button");

unverifyButton.addEventListener("click", function() {
    showModal("Unverify");
});

deleteButton.addEventListener("click", function() {
    showModal("Delete");
});

banButton.addEventListener("click", function() {
    showModal("Ban");
});

cancelButton.addEventListener("click", function() {
    hideModal();
});

confirmButton.addEventListener("click", function() {
    // Handle the action (e.g., perform deletion or other actions)
    // You can add your logic here
    alert("Action confirmed!"); // Replace this with your actual action
    hideModal();
});

// Function to display the modal
function showModal(action) {
    modal.style.display = "block";
    document.querySelector(".modal-content p").textContent = `Are you sure you want to ${action} this user?`;
}

// Function to hide the modal
function hideModal() {
    modal.style.display = "none";
}
