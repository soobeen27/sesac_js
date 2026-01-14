// const BASE_URL = 'http://127.0.0.1:3000/api';

export async function fetchSearch(query, page = 1, display = 10) {
  const res = await fetch(`/api/search?query=${encodeURIComponent(query)}&page=${page}&display=${display}`);
  if (!res.ok) throw new Error('fetch 도중 에러남');
  const data = await res.json();
  return data;
}
