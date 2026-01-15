// -----------------------------------------------------------
// 1. 파이어베이스 설정 (여기에 지휘관님의 진짜 키를 넣어주세요!)
// -----------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyCVVP6ensnpr3h0uUtpwqcdBsNfc56KgWA",
  authDomain: "site-ddd9d.firebaseapp.com",
  projectId: "site-ddd9d",
  storageBucket: "site-ddd9d.firebasestorage.app",
  messagingSenderId: "1057082364957",
  appId: "1:1057082364957:web:807cacc7536e7f9bf0a2f4"
};

// 파이어베이스 시작
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();


// -----------------------------------------------------------
// 2. 버튼 기능들 (로그인, 가입, 로그아웃, 글쓰기)
// -----------------------------------------------------------

// 회원가입
function signup() {
    const email = document.getElementById('new-id').value;
    const password = document.getElementById('new-pw').value;

    if (password.length < 6) {
        alert('비밀번호는 6자리 이상이어야 합니다!');
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            alert("가입 성공! 환영합니다.");
            window.location.href = 'index.html';
        })
        .catch((error) => {
            alert("오류 발생: " + error.message);
        });
}

// 로그인
function login() {
    const email = document.getElementById('userid').value;
    const password = document.getElementById('userpw').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            alert("로그인 성공!");
            window.location.href = 'main.html';
        })
        .catch((error) => {
            alert("로그인 실패.. 아이디/비번을 확인하세요.");
        });
}

// 로그아웃
function logout() {
    auth.signOut().then(() => {
        // alert("로그아웃 되었습니다."); // 귀찮은 팝업 삭제!
        window.location.href = 'index.html';
    });
}

// 방명록 쓰기
function writeGuestbook() {
    const msgInput = document.getElementById('guest-msg');
    const msg = msgInput.value;
    const user = auth.currentUser;

    if (!user) {
        alert("로그인해야 쓸 수 있습니다!");
        return;
    }
    if (msg.length < 2) {
        alert("내용을 더 써주세요!");
        return;
    }

    db.collection("guestbook").add({
        name: user.email,
        message: msg,
        date: new Date()
    })
    .then(() => {
        alert("등록 완료!");
        msgInput.value = "";
    })
    .catch((error) => {
        alert("오류: " + error.message);
    });
}


// -----------------------------------------------------------
// 3. 페이지 관리자 (여기가 팝업 범인을 잡는 곳!)
// -----------------------------------------------------------
window.onload = function() {
    // 🔍 지금 내가 있는 곳이 메인 페이지(main.html)인지 확인
    const isMainPage = document.getElementById('guestbook-list');

    // 🚨 메인 페이지가 아니면(로그인 화면이면) 아무것도 하지 마! (팝업 금지)
    if (!isMainPage) {
        return; 
    }

    // 메인 페이지일 때만 감시 시작
    auth.onAuthStateChanged((user) => {
        if (user) {
            // 로그인 된 상태 -> 방명록 보여주기
            document.getElementById('username').innerText = user.email;
            
            db.collection("guestbook").orderBy("date", "desc").onSnapshot((snapshot) => {
                const list = document.getElementById('guestbook-list');
                list.innerHTML = "";
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    list.innerHTML += `
                        <div class="card mb-2 p-2 shadow-sm">
                            <small class="text-primary fw-bold">${data.name}</small>
                            <span class="fs-5">${data.message}</span>
                        </div>`;
                });
            });
        } else {
            // 로그인 안 된 상태 -> 조용히 로그인 화면으로 보냄
            location.href = 'index.html';
        }
    });
};