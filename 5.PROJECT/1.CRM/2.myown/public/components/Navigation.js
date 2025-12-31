import Component from './Component.js';

export default class Navigation extends Component {
    setup() {
        this.state = this.props;
    }

    template() {
        const navItems = this.state
            .map((item) => {
                const { title, link } = item;
                return `
                    <li>
                        <a class="text-black transition hover:text-gray-500/75" href="${link}"> ${title} </a>
                    </li>`;
            })
            .join('');
        return `        
            <div class="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-8">
                <div class="flex flex-1 items-center justify-end md:justify-between">
                    <nav aria-label="Global" class="hidden md:block">
                        <ul class="flex items-center gap-6 text-sm">
                            ${navItems}        
                        </ul>
                    </nav>
                </div>
            </div>`;
    }
}
