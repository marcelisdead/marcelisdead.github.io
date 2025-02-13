// Function to load an external HTML file into an element
async function loadHTML(elementId, file) {
    try {
        const response = await fetch(file); // Fetch the file
        if (!response.ok) throw new Error(`Could not load ${file}: ${response.statusText}`);
        const html = await response.text(); // Get the content as text
        document.getElementById(elementId).innerHTML = html; // Insert into the page
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


loadCSS('/css/main.css', true);

// Load header and footer
loadHTML('header', '/includes/header.html');
loadHTML('footer', '/includes/footer.html');