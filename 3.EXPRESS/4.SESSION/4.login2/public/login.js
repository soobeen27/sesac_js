document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    document.getElementById('login-button').addEventListener('click', login);
    document.getElementById('logout-button').addEventListener('click', logout);
    document.getElementById('show-signup-button').addEventListener('click', () => {
        show(ELEMENT_KEYS.SIGNUP);
    });
    document.getElementById('signup-button').addEventListener('click', signup);
    document.getElementById('delete-button').addEventListener('click', deleteAccount);
});

const ELEMENT_KEYS = {
    LOGIN: 'loginFormContainer',
    SIGNUP: 'signupFormContainer',
    PROFILE: 'profile',
};

const elements = {
    loginFormContainer: document.getElementById('loginFormContainer'),
    signupFormContainer: document.getElementById('signupFormContainer'),
    profile: document.getElementById('profile'),
};

function logout(e) {
    fetch('/logout')
        .then((res) => res.json())
        .then((data) => {
            if (data.message === '로그아웃 성공') {
                show(ELEMENT_KEYS.LOGIN);
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
                show(ELEMENT_KEYS.LOGIN);
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
                showProfile(username);
            } else {
                alert('로그인 실패');
            }
        });
}

function signup(e) {
    e.preventDefault();

    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const passwordCheck = document.getElementById('signup-password-check').value;
    if (password !== passwordCheck) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    fetch('/signup', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data.message);
            if (data.message == '회원가입 성공') {
                showProfile(username);
            } else {
                alert(data.message);
            }
        });
}

function deleteAccount(e) {
    e.preventDefault();
    const username = document.getElementById('usernameSpan').innerText;
    fetch('/delete-account', {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.message == '회원탈퇴 성공') {
                show(ELEMENT_KEYS.LOGIN);
            } else {
                alert(data.message);
            }
        });
}

function show(key) {
    Object.keys(elements).forEach((k) => {
        elements[k].style.display = k === key ? 'block' : 'none';
    });
}

function showProfile(username) {
    show(ELEMENT_KEYS.PROFILE);
    document.getElementById('usernameSpan').innerText = username;
}
