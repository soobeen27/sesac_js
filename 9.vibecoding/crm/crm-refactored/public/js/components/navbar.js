export const renderNavbar = () => {
    const tables = ['users', 'stores', 'items', 'orders', 'orderitems'];
    const links = tables.map(t => 
        `<a href="/list.html?table=${t}" class="hover:text-blue-200 uppercase font-semibold transition text-sm">${t}</a>`
    ).join('');

    const html = `
    <nav class="bg-blue-600 text-white shadow-md mb-8">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
            <a href="/" class="text-2xl font-bold flex items-center gap-2">
                <span>📊</span> CRM System
            </a>
            <div class="space-x-4 hidden md:block">
                ${links}
            </div>
        </div>
    </nav>`;
    
    document.body.insertAdjacentHTML('afterbegin', html);
};