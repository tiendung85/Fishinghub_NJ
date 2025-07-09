// Script to analyze favorite_bait values in FishData.json
const fs = require('fs');
const path = require('path');

// Read the JSON file
const fishDataPath = path.join(__dirname, 'src', 'pages', 'Knowledge', 'FishData.json');
const fishData = JSON.parse(fs.readFileSync(fishDataPath, 'utf8'));

// Extract all favorite_bait values
const fishList = fishData.freshwater_fish_vietnam;
const baitMap = new Map(); // Map to store lowercase -> original pairs

// Find duplicates that differ only in capitalization
fishList.forEach(fish => {
    const bait = fish.favorite_bait;
    const baitLower = bait.toLowerCase();
    
    if (baitMap.has(baitLower)) {
        // Found a duplicate with different capitalization
        console.log(`Found duplicate: "${baitMap.get(baitLower)}" and "${bait}"`);
    } else {
        baitMap.set(baitLower, bait);
    }
});

// Extract individual bait items
const individualBaits = new Map();
fishList.forEach(fish => {
    const baitItems = fish.favorite_bait.split(/,\s*/);
    baitItems.forEach(item => {
        const itemLower = item.toLowerCase();
        if (individualBaits.has(itemLower)) {
            if (individualBaits.get(itemLower) !== item) {
                console.log(`Individual bait capitalization difference: "${individualBaits.get(itemLower)}" vs "${item}"`);
            }
        } else {
            individualBaits.set(itemLower, item);
        }
    });
});

console.log("Analysis complete");