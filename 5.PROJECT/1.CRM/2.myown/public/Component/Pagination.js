import Component from './Component.js';

export default class Pagination extends Component {
    setup() {
        this.state = this.props;
        this.limit = this.props.limit;
        this.currentPage = 1;
        this.offset = 0;
        this.listener = [];
    }

    subscribe(listener) {
        this.listener.push(listener);
    }

    mounted() {
        this.offset = (this.currentPage - 1) * this.limit;
        if (this.listener.length > 0) this.listener.forEach((f) => f(this.limit, this.offset));
    }

    setEvent() {
        this.addEvent('click', '#previousPageBtn', () => {
            if (this.currentPage > 1) this.setState((this.currentPage -= 1));
        });
        this.addEvent('click', '#nextPageBtn', () => {
            if (this.currentPage < Math.ceil(this.state.count / this.limit)) this.setState((this.currentPage += 1));
        });
    }

    template() {
        return `
        <ul class="flex justify-center gap-3 text-gray-900">
            <li>
                <button id ="previousPageBtn"
                    class="grid size-8 place-content-center rounded border border-gray-200 transition-colors hover:bg-gray-50 rtl:rotate-180"
                    aria-label="Previous page"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fill-rule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                        ></path>
                    </svg>
                </button>
            </li>

            <li class="text-sm/8 font-medium tracking-widest">${this.currentPage}/${Math.ceil(
            this.state.count / this.limit
        )}</li>

            <li>
                <button id="nextPageBtn"
                    class="grid size-8 place-content-center rounded border border-gray-200 transition-colors hover:bg-gray-50 rtl:rotate-180"
                    aria-label="Next page"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fill-rule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clip-rule="evenodd"
                        ></path>
                    </svg>
                </button>
            </li>
        </ul>`;
    }
}
