import Child from './Child';

export default function Parent() {
    let message = '';
    const handleMessage = (data) => {
        message = data;
    };
    return (
        <div>
            <h2>부모</h2>
            <p>자식에게서 받아온 값: {message}</p>
            <Child sendMessageToParent={handleMessage} />
        </div>
    );
}
