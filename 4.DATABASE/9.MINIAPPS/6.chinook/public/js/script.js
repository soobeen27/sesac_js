document.addEventListener('DOMContentLoaded', async () => {
    const res = await fetch('/api/tracks?limit=10&offset=0');
    const data = await res.json();
    console.log(data);
});
