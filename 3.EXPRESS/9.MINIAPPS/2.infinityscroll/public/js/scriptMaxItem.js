const itemsPerLoad = 20;
const maxItemsOnScreen = 200;
let start = 0;
let end = start + itemsPerLoad;

async function getItemsFromTo(start, end) {
    try {
        const res = await fetch(`/api/items?start=${start}&end=${end}`);
        const data = await res.json();
        const result = document.getElementById('result');
        data.forEach((item) => {
            const itemEl = document.createElement('div');
            itemEl.textContent = item;
            itemEl.classList.add('item');
            result.appendChild(itemEl);

            let itemsToRemove = result.children.length - maxItemsOnScreen;
            if (itemsToRemove > 0) {
                while (itemsToRemove-- >= 0) {
                    result.removeChild(result.firstElementChild);
                }
            }
        });
    } catch (e) {
        console.log(e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getItemsFromTo(start, end);
});

window.addEventListener('scroll', async () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        console.log('화면끝');
        start = end;
        end += itemsPerLoad;
        getItemsFromTo(start, end);
    }
});
