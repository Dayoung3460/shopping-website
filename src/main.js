function loadItems(){
    return fetch('data/data.json')
    .then(response => response.json()) 
    .then(json => json.items); 
}

// Update the list with the given items
function displayItems(items){
    const container = document.querySelector('.viewCon');
    container.innerHTML = items.map(item => createHTMLString(item)).join('');
}


// Create HTML div item from the given data item
function createHTMLString(item){
    return `
    <div>
        <img src="${item.image}" alt="${item.type}" class="item_thumbnail" />
        <span class="item_description">${item.gender}, ${item.size}</span>
    </div>
    `;  
}

function onButtonClick(event, items){
    const dataset = event.target.dataset;
    const key = dataset.key;
    const value = dataset.value;

    if(key == null || value == null){
        return;
    }

    const filtered = items.filter(item => item[key] === value);
    console.log(filtered);
    displayItems(filtered);
}

function setEventListeners(items) {
    const logo = document.querySelector('.logoCon');
    const btns = document.querySelector('.btnCon');
    logo.addEventListener('click', () => displayItems(items));
    btns.addEventListener('click', event => onButtonClick(event, items));
}

loadItems()
.then(items => {
    displayItems(items);
    setEventListeners(items);
})
.catch(console.log)