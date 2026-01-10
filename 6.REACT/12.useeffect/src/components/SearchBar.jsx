export default function SearchBar({ onSearch, keyword }) {
  return (
    <div className="m-4">
      <input value={keyword} type="text" onChange={(e) => onSearch(e.target.value)} placeholder="이름검색" />
      {/* <button
        onClick={() => {
          onSearch(text);
        }}
      >
        검색
      </button> */}
    </div>
  );
}
