const USERS = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' },
];

const API_DELAY_MS = 500;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchUsers() {
  await sleep(API_DELAY_MS);
  return USERS;
}

export async function fetchUserById(userId) {
  await sleep(API_DELAY_MS);
  const user = USERS.find((u) => String(u.id) === String(userId)) || null;
  return user;
}
