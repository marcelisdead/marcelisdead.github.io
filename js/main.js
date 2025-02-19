// Prevent default anchor jump by setting `scrollRestoration` to "manual"
history.scrollRestoration = "manual";

// Function to load an external HTML file into an element
async function loadHTML(elementId, file, callback = null) {
    try {
        const response = await fetch(file); // Fetch the file
        if (!response.ok) throw new Error(`Could not load ${file}: ${response.statusText}`);
        const html = await response.text(); // Get the content as text
        document.getElementById(elementId).innerHTML = html; // Insert into the page

        if (callback) callback();
    } catch (error) {
        console.error(error);
    }
}

// Function to inject a CSS file into the <head> at the top (default) or bottom
function loadCSS(href, insertAtTop = true) {
    if (!document.querySelector(`link[href="${href}"]`)) { // Prevent duplicate loading
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;

        if (insertAtTop) {
            document.head.prepend(link); // Add at the beginning
        } else {
            document.head.appendChild(link); // Add at the end
        }
    }
}


// Load CSS first
loadCSS('/css/main.css', true);

// Function to adjust scroll to the anchor without delay
function adjustScrollForAnchor() {
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
            const navbarHeight = document.getElementById("header")?.offsetHeight || 0;
            window.scrollTo(0, targetElement.offsetTop - navbarHeight);
        }
    }
}

// Load header and footer, ensuring smooth scrolling is applied immediately
loadHTML('header', '/includes/header.html', function() {
    adjustScrollForAnchor();
});
loadHTML('footer', '/includes/footer.html');

// Also adjust scroll immediately on DOM load
document.addEventListener("DOMContentLoaded", adjustScrollForAnchor);
