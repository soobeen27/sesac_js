export default class Component {
    state;
    constructor(target, props) {
        this.target = target;
        this.props = props;
        this.setup();
        this.setEvent();
        this.render();
    }

    setup() {}

    template() {
        return '';
    }

    render() {
        this.target.innerHTML = this.template();
        this.mounted();
    }

    setEvent() {}

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }

    mounted() {}

    addEvent(eventType, selector, callback) {
        this.target.addEventListener(eventType, (e) => {
            if (!e.target.closest(selector)) return;
            callback(e);
        });
    }
}
