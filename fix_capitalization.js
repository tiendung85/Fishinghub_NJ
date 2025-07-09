// Script to fix capitalization in favorite_bait values in FishData.json
const fs = require('fs');
const path = require('path');

// Read the JSON file
const fishDataPath = path.join(__dirname, 'src', 'pages', 'Knowledge', 'FishData.json');
const fishData = JSON.parse(fs.readFileSync(fishDataPath, 'utf8'));

// Function to capitalize first letter of each word
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Create a map of standardized bait items
const standardizedBaits = new Map();
const fishList = fishData.freshwater_fish_vietnam;

// First pass: collect all unique bait items and standardize them
fishList.forEach(fish => {
    const baitItems = fish.favorite_bait.split(/,\s*/);
    baitItems.forEach(item => {
        // Remove period if it's the last character
        let cleanItem = item;
        if (cleanItem.endsWith('.')) {
            cleanItem = cleanItem.slice(0, -1);
        }
        const itemLower = cleanItem.toLowerCase();
        // Always use the capitalized version
        standardizedBaits.set(itemLower, capitalizeFirstLetter(itemLower));
    });
});

// Second pass: update all favorite_bait values with standardized capitalization
fishList.forEach(fish => {
    // Remove the period at the end of the entire string first
    let baitString = fish.favorite_bait;
    if (baitString.endsWith('.')) {
        baitString = baitString.slice(0, -1);
    }

    // Split by comma and filter out empty items
    const baitItems = baitString.split(/,\s*/).filter(item => item.trim() !== '');

    // Process each item
    const standardizedItems = baitItems.map(item => {
        // Remove period if it's the last character (just in case)
        let cleanItem = item;
        if (cleanItem.endsWith('.')) {
            cleanItem = cleanItem.slice(0, -1);
        }
        const itemLower = cleanItem.toLowerCase();
        return standardizedBaits.get(itemLower);
    }).filter(item => item); // Filter out any undefined items

    // Join the items back together with the original formatting
    fish.favorite_bait = standardizedItems.join(', ') + '.';
});

// Write the updated data back to the file
fs.writeFileSync(fishDataPath, JSON.stringify(fishData, null, 2), 'utf8');

console.log("Capitalization standardized successfully");
