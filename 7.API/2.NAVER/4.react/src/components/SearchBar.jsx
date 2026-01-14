export default function SearchBar({ onSearch, setQuery }) {
  return (
    <form
      onSubmit={(e) => {
        onSearch(e);
      }}
    >
      <input type="text" placeholder="검색어를 입력하세요" onChange={(e) => setQuery(e.target.value)} />
      <button type="submit">검색</button>
    </form>
  );
}
