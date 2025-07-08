document.addEventListener("DOMContentLoaded", function() {
    // Hamburger menu toggle functionality
    document.querySelector(".menu-toggle").addEventListener("click", function() {
        document.querySelector(".nav-list").classList.toggle("active");
    });

    // Dynamic page highlight functionality
    let currentPage = window.location.pathname.split("/").pop();
    let navLinks = document.querySelectorAll(".nav-list a");

    navLinks.forEach(link => {
        if(link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
});
