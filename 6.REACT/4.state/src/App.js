import { useState } from 'react';

import Message from './Message';

export default function App() {
    const [count, setCount] = useState(0);

    const countInc = () => {
        setCount(count + 1);
    };
    const countDes = () => {
        setCount(count - 1);
    };
    const countInit = () => {
        setCount(0);
    };

    return (
        <>
            <h1>count</h1>
            <p>{count}</p>
            <button onClick={countInc}>+1 증가</button>
            <button onClick={countDes}>-1 감소</button>
            <button onClick={countInit}>초기화</button>
            <Message count={count} />
        </>
    );
}
