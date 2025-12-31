import Component from './Component.js';

export default class Table extends Component {
    setup() {
        this.state = this.props;
    }

    setState(newState) {
        this.state = newState;
        this.render();
    }

    template() {
        const headers = this._getHeader();
        const body = this._getBody();
        const tableHTML = `
            <div class="overflow-x-auto rounded border border-gray-300 shadow-sm">
                <table class="min-w-full divide-y-2 divide-gray-200">
                    <thead class="ltr:text-left rtl:text-right">
                        <tr class="*:font-medium *:text-gray-900">
                            ${headers}
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${body}
                    </tbody>
                </table>
            </div>`;
        return tableHTML;
    }

    _getHeader() {
        return Object.keys(this.state[0])
            .map((h) => {
                return `<th class="px-3 py-2 whitespace-nowrap">${h}</th>`;
            })
            .join('');
    }

    _getBody() {
        return this.state
            .map((row) => {
                let tds = '';
                for (const [key, value] of Object.entries(row)) {
                    tds += `<td class="px-3 py-2 whitespace-nowrap">${value}</td>`;
                }
                return `<tr class="*:text-gray-900 *:first:font-medium">${tds}</tr>`;
            })
            .join('');
    }
}
