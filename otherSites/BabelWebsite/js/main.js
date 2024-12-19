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

// Load header and footer
loadHTML('header', 'includes/header.html');
loadHTML('footer', 'includes/footer.html');

function ToPage(string){
    window.location.href = string;
}