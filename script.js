let items = {
    'Common': ['Common'],
    '5 Medallions': ['5 Medallions'],
    '1 Medallion': ['1 Medallion'],
    'Chibi': ['Chibi'],
    'Rarer Chibi': ['Rare Chibi'],
    '4 Medallions': ['4 Medallions']
};

let rarity_probabilities = {
    'Common': 0.9689,
    '5 Medallions': 0.003,
    '1 Medallion': 0.025,
    'Chibi': 0.003,
    'Rarer Chibi': 0.0001
};

const LOOTBOX_COST = 1.3;
let results = { 'Common': 0, 'Chibi': 0, 'Rare Chibi': 0 };
let items_obtained = [];
let pull_count = 0;
let total_medallions = 0;
let hit_rarer_chibi = false;

function getRandomRarity() {
    const rand = Math.random();
    let sum = 0;
    for (const rarity in rarity_probabilities) {
        sum += rarity_probabilities[rarity];
        if (rand < sum) {
            return rarity;
        }
    }
    return 'Common';  // Fallback, should not happen
}

function openLootbox() {
    pull_count++;
    let item;

    if (pull_count % 60 === 0) {
        item = '4 Medallions';
        total_medallions += 4;
    } else {
        const rarity = getRandomRarity();
        item = items[rarity][0];
        if (rarity === '5 Medallions') {
            total_medallions += 5;
        } else if (rarity === '1 Medallion') {
            total_medallions += 1;
        }
    }

    if (item === 'Common') {
        results['Common']++;
    } else if (item === 'Chibi') {
        results['Chibi']++;
    } else if (item === 'Rare Chibi') {
        results['Rare Chibi']++;
        hit_rarer_chibi = true;
    }

    items_obtained.push(item);
    updateUI();
}

function open10Lootboxes() {
    for (let i = 0; i < 10; i++) {
        openLootbox();
    }
}

function openUntilMilestone() {
    while (total_medallions < 25 && !hit_rarer_chibi) {
        openLootbox();
    }
}

function openUntil10MedallionsOrChibi() {
    while (total_medallions < 10 && results['Chibi'] === 0) {
        openLootbox();
    }
}

function resetSimulator() {
    results = { 'Common': 0, 'Chibi': 0, 'Rare Chibi': 0 };
    items_obtained = [];
    pull_count = 0;
    total_medallions = 0;
    hit_rarer_chibi = false;
    updateUI();
}

function updateUI() {
    document.getElementById('chest-count').textContent = `Chests Opened: ${items_obtained.length}`;
    document.getElementById('total-medallions').textContent = `Total Medallions: ${total_medallions}`;
    document.getElementById('common-count').textContent = `Common: ${results['Common']}`;
    document.getElementById('chibi-count').textContent = `Chibi: ${results['Chibi']}`;
    document.getElementById('rarer-chibi-count').textContent = `Rare Chibi: ${results['Rare Chibi']}`;
    document.getElementById('total-cost').textContent = `Total Cost: £${(items_obtained.length * LOOTBOX_COST).toFixed(2)}`;

    const itemsList = document.getElementById('items-list');
    itemsList.innerHTML = '';
    items_obtained.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        itemsList.appendChild(li);
    });
}
