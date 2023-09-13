// Get the current URL
var currentUrl = window.location.href;

// Check if the current URL matches any of the links and add the "active" class
if (currentUrl.includes("/v1/home")) {
    document.getElementById("home").classList.add("active");
} else if (currentUrl.includes("/v1/upload")) {
    document.getElementById("upload").classList.add("active");
} else if (currentUrl.includes("/v1/manage_user")) {
    document.getElementById("manage_user").classList.add("active");
} else if (currentUrl.includes("/v1/manage_admin")) {
    document.getElementById("manage_admin").classList.add("active");
}
