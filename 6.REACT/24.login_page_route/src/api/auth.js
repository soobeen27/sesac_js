export function fetchLogin({ id, pw }) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (id === 'admin' && pw === '1234') {
        res({ ok: true, user: { id } });
      } else {
        rej(new Error('아이디 또는 비밀번호가 올바르지 않습니다'));
      }
    }, 1000);
  });
}
