const BASE_URL = 'https://jsonplaceholder.typicode.com';

//signal은 비동기 오퍼레이션을 중단할수있는 값임
async function requestJson(url, { signal } = {}) {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchUsers({ signal } = {}) {
  return requestJson(`${BASE_URL}/users`, { signal });
}

export async function fetchUserById(userId, { signal } = {}) {
  return requestJson(`${BASE_URL}/users/${userId}`, { signal });
}

export async function deleteUserById(userId) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
    method: 'delete',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
