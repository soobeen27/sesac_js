import { useState } from 'react';
import { fetchSearch } from './api/naverBlogApi';
import SearchBar from './components/SearchBar';
import SearchResult from './components/SearchResult';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResult] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    try {
      const data = await fetchSearch(trimmedQuery);
      setResult(data.items);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h1>blog search</h1>
      <SearchBar onSearch={handleSearch} setQuery={setQuery} />
      <SearchResult results={results} />
    </div>
  );
}

export default App;
