document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    document.getElementById('login-button').addEventListener('click', login);
    document.getElementById('logout-button').addEventListener('click', logout);
});

function logout(e) {
    fetch('/logout')
        .then((res) => res.json())
        .then((data) => {
            if (data.message === '로그아웃 성공') {
                showLoginForm();
            } else {
                alert(data.message);
            }
        });
}

function checkLoginStatus() {
    fetch('/check-login')
        .then((res) => res.json())
        .then((data) => {
            if (data.username) {
                showProfile(data.username);
            } else {
                showLoginForm();
            }
        });
}

function login(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.message == '로그인 성공') {
                // window.location.href = '/profile';
                showProfile(username);
            } else {
                alert('로그인 실패');
            }
        });
}

function showProfile(username) {
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('profile').style.display = 'block';
    document.getElementById('usernameSpan').innerText = username;
}

function showLoginForm() {
    document.getElementById('loginFormContainer').style.display = 'block';
    document.getElementById('profile').style.display = 'none';
}
