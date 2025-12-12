const itemsPerLoad = 20;
const maxItemsOnScreen = 60;
let start = 0;
let end = start + itemsPerLoad;
let isLoading = false;
const result = document.getElementById('result');

async function getItemsFromTo(s, e, topbottom) {
    if (isLoading) return;
    isLoading = true;
    console.log(`start: ${s} end: ${e}`);

    try {
        const res = await fetch(`/api/items?start=${s}&end=${e}`);
        const data = await res.json();

        if (topbottom === 'top') {
            const prevScrollHeight = document.documentElement.scrollHeight;
            const items = data.map((item) => {
                const itemEl = document.createElement('div');
                itemEl.textContent = item;
                itemEl.classList.add('item');
                return itemEl;
            });
            result.prepend(...items);
            // const nextScrollHeight = document.body.scrollHeight;
            const nextScrollHeight = document.documentElement.scrollHeight;
            // window.scrollTo(0, window.scrollY + (nextScrollHeight - prevScrollHeight));
            window.scrollTo(0, document.documentElement.scrollTop + (nextScrollHeight - prevScrollHeight));
        } else {
            data.forEach((item) => {
                const itemEl = document.createElement('div');
                itemEl.textContent = item;
                itemEl.classList.add('item');
                result.appendChild(itemEl);
            });
        }
        let itemsToRemove = result.children.length - maxItemsOnScreen;
        if (itemsToRemove > 0) {
            if (topbottom === 'top') {
                removeLast(itemsToRemove);
                end -= itemsToRemove;
            } else if (topbottom === 'bottom') {
                removeFirst(itemsToRemove);
                start += itemsToRemove;
            }
        }
        const resultChildren = Array.from(result.children).map((child) => {
            return child.textContent;
        });
        console.log(resultChildren);
    } catch (e) {
        console.log(e);
    } finally {
        isLoading = false;
    }
}

function removeFirst(itemsToRemove) {
    let removedHeight = 0;
    for (let i = 0; i < itemsToRemove; i++) {
        if (result.firstElementChild) {
            // removedHeight += result.firstElementChild.offsetHeight;
            removedHeight += result.firstElementChild.getBoundingClientRect().height;
            result.removeChild(result.firstElementChild);
        }
    }
    // window.scrollTo(0, window.scrollY - removedHeight);
    window.scrollTo(0, document.documentElement.scrollTop - removedHeight);
}

function removeLast(itemsToRemove) {
    for (let i = 0; i < itemsToRemove; i++) {
        result.removeChild(result.lastElementChild);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getItemsFromTo(start, end, '');
});

window.addEventListener('scroll', async () => {
    // console.log(`scrollTop: ${document.documentElement.scrollTop} scrollY: ${window.scrollY}`);
    // console.log(`clientHeight: ${document.documentElement.clientHeight} innerHeight: ${window.innerHeight}`);
    // console.log(
    //     `scrollHeight: ${document.documentElement.scrollHeight} body.offsetHeight: ${document.body.offsetHeight}`
    // );
    if (isLoading) return;
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    // if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    if (scrollTop + clientHeight >= scrollHeight) {
        console.log('화면끝');
        const nextEnd = end + itemsPerLoad;
        await getItemsFromTo(end, nextEnd, 'bottom');
        end = nextEnd;
    }
    // if (window.scrollY <= 10) {
    if (scrollTop <= 10) {
        console.log('화면시작');
        if (start > 0) {
            const nextStart = Math.max(0, start - itemsPerLoad);
            await getItemsFromTo(nextStart, start, 'top');
            start = nextStart;
        }
    }
});
