// js/auth.js

// 1. 회원가입
function signup() {
    const id = document.getElementById('new-id').value;
    const pw = document.getElementById('new-pw').value;

    if (id.length === 0 || pw.length === 0) {
        alert('빈칸을 모두 채워주세요.');
        return;
    }

    if (localStorage.getItem(id)) {
        alert('이미 존재하는 아이디입니다.');
        return;
    }

    localStorage.setItem(id, pw);
    alert('가입 성공! 로그인 해주세요.');
    location.href = 'index.html';
}

// 2. 로그인 (업그레이드!)
function login() {
    const id = document.getElementById('userid').value;
    const pw = document.getElementById('userpw').value;
    const storedPw = localStorage.getItem(id);

    if (!storedPw) {
        alert('존재하지 않는 아이디입니다.');
    } else if (storedPw !== pw) {
        alert('비밀번호가 틀렸습니다.');
    } else {
        alert(id + '님 환영합니다!');
        
        // ✨ 핵심: 현재 로그인한 사람 기억하기
        localStorage.setItem('loginUser', id);
        
        // ✨ 핵심: 메인 페이지로 이동!
        location.href = 'main.html';
    }
}

// 3. 로그아웃 (New!)
function logout() {
    alert('로그아웃 되었습니다.');
    // 로그인 기록 삭제
    localStorage.removeItem('loginUser');
    // 로그인 페이지로 쫓아냄
    location.href = 'index.html';
}