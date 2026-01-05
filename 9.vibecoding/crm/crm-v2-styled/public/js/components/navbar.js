export const renderNavbar = () => {
    const tables = ['users', 'stores', 'items', 'orders', 'orderitems'];
    const currentTable = new URLSearchParams(window.location.search).get('table');

    const links = tables.map(t => {
        const isActive = currentTable === t;
        const activeClass = isActive ? "bg-indigo-700 text-white" : "text-indigo-100 hover:bg-indigo-600 hover:text-white";
        return `<a href="/list.html?table=${t}" class="${activeClass} px-3 py-2 rounded-md text-sm font-medium transition-colors uppercase">${t}</a>`
    }).join('');

    const html = `
    <nav class="bg-indigo-800 shadow-lg mb-8 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <div class="flex items-center gap-3">
                    <span class="text-2xl">🚀</span>
                    <a href="/" class="text-white text-xl font-bold tracking-tight">Pro CRM</a>
                </div>
                <div class="hidden md:block">
                    <div class="ml-10 flex items-baseline space-x-4">
                        ${links}
                    </div>
                </div>
            </div>
        </div>
    </nav>`;
    
    document.body.insertAdjacentHTML('afterbegin', html);
};