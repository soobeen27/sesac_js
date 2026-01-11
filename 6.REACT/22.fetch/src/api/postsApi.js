const BASE_URL = 'https://jsonplaceholder.typicode.com';

async function get(url, { signal } = {}) {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`GET error: ${res.status}`);
  return res.json();
}

export function fetchPosts({ signal } = {}) {
  return get(`${BASE_URL}/posts`, { signal });
}

export function fetchPostById(postId, { signal } = {}) {
  return get(`${BASE_URL}/posts/${postId}`, { signal });
}

export function fetchCommentsById(postId, { signal } = {}) {
  return get(`${BASE_URL}/posts/${postId}/comments`, { signal });
}
