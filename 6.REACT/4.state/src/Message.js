// import './Message.css';

export default function Message({ count }) {
    const messageStyle = {
        backgroundColor: 'black',
        color: 'lightblue',
        padding: '10px',
        borderRadius: '10px',
        textAlign: 'center',
        fontWeight: 'bold',
    };
    // return <p className="message">현재 카운트는 {count} 입니다</p>;
    return <p style={messageStyle}>현재 카운트는 {count} 입니다</p>;
}
