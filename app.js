// Initialize default sample data so the registry isn't completely empty at first
const defaultItems = [
    {
        id: 1,
        type: "lost",
        name: "Casio fx-991EX Scientific Calculator",
        category: "Electronics & Gadgets",
        location: "Lecture Hall 204",
        description: "Black calculator with a small yellow sticker on the back cover.",
        date: "Today"
    },
    {
        id: 2,
        type: "found",
        name: "Blue Hydro Flask Water Bottle",
        category: "Personal Belongings",
        location: "Central Library 2nd Floor",
        description: "Left near the charging stations. Turned in to library desk.",
        date: "Yesterday"
    }
];

// Load items from browser storage, or use defaults if none exist yet
function getItems() {
    const stored = localStorage.getItem("foundit_items");
    if (!stored) {
        localStorage.setItem("foundit_items", JSON.stringify(defaultItems));
        return defaultItems;
    }
    return JSON.parse(stored);
}

// 1. Handle Report Submission (Runs on report.html)
const reportForm = document.getElementById("report-form");
if (reportForm) {
    reportForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Stops the page from refreshing and losing data

        const newItem = {
            id: Date.now(),
            type: document.getElementById("report-type").value,
            name: document.getElementById("item-name").value,
            category: document.getElementById("item-category").value,
            location: document.getElementById("item-location").value,
            description: document.getElementById("item-desc").value,
            date: new Date().toLocaleDateString()
        };

        const items = getItems();
        items.unshift(newItem); // Put newest item at the top
        localStorage.setItem("foundit_items", JSON.stringify(items));

        alert("Report logged! Redirecting you to the live registry...");
        window.location.href = "browse.html"; // Automatically takes you to Browse Items
    });
}

// 2. Render Items on Browse Page (Runs on browse.html)
const itemsGrid = document.getElementById("items-grid");
if (itemsGrid) {
    const items = getItems();
    
    // Check if user searched from the home page
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get("search")?.toLowerCase() || "";

    const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery) ||
        item.location.toLowerCase().includes(searchQuery) ||
        item.description.toLowerCase().includes(searchQuery)
    );

    if (filteredItems.length === 0) {
        itemsGrid.innerHTML = `<p>No matching items found in the registry.</p>`;
    } else {
        itemsGrid.innerHTML = filteredItems.map(item => `
            <div class="item-card">
                <span class="status-tag ${item.type}">${item.type.toUpperCase()}</span>
                <h3>${item.name}</h3>
                <p class="meta"><strong>Location:</strong> ${item.location} • <strong>Category:</strong> ${item.category}</p>
                <p class="desc">${item.description}</p>
                <div class="card-footer">
                    <small>Logged: ${item.date}</small>
                    <button onclick="alert('Contact request sent to campus security / reporter for: ${item.name}')">Claim / Contact</button>
                </div>
            </div>
        `).join("");
    }
}