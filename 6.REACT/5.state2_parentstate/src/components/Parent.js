import { useState } from 'react';
import Child from './Child';

export default function Parent() {
    const [message, setMessage] = useState('');
    const handleMessage = (data) => {
        setMessage(data);
    };
    return (
        <div>
            <h2>부모</h2>
            <p>자식에게서 받아온 값: {message}</p>
            <Child sendMessageToParent={handleMessage} />
        </div>
    );
}
