// 1. 파이어베이스 연결 설정 (여기에 아까 그 키를 넣어야 합니다!)
const firebaseConfig = {
  apiKey: "AIzaSyCVVP6ensnpr3h0uUtpwqcdBsNfc56KgWA",
  authDomain: "site-ddd9d.firebaseapp.com",
  projectId: "site-ddd9d",
  storageBucket: "site-ddd9d.firebasestorage.app",
  messagingSenderId: "1057082364957",
  appId: "1:1057082364957:web:807cacc7536e7f9bf0a2f4"
};
// 2. 파이어베이스 시작
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 3. 회원가입 기능 (서버로 보냄)
function signup() {
    const email = document.getElementById('new-id').value; // 아이디를 이메일처럼 씀
    const password = document.getElementById('new-pw').value;

    if (password.length < 6) {
        alert('비밀번호는 6자리 이상이어야 합니다!');
        return;
    }

    // 서버에 계정 생성 요청
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert("가입 성공! 환영합니다.");
            window.location.href = 'index.html';
        })
        .catch((error) => {
            alert("오류 발생: " + error.message);
        });
}

// 4. 로그인 기능 (서버에서 확인)
function login() {
    const email = document.getElementById('userid').value;
    const password = document.getElementById('userpw').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert("로그인 성공!");
            window.location.href = 'main.html';
        })
        .catch((error) => {
            alert("로그인 실패.. 아이디나 비번을 확인하세요.");
        });
}

// 5. 로그아웃 기능
function logout() {
    auth.signOut().then(() => {
        alert("로그아웃 되었습니다.");
        window.location.href = 'index.html';
    });
}
// -------------------------------------------
// 🚀 여기서부터 방명록 기능입니다!
// -------------------------------------------

// 1. 방명록 쓰기 기능
function writeGuestbook() {
    const msgInput = document.getElementById('guest-msg');
    const msg = msgInput.value;
    const user = firebase.auth().currentUser; // 현재 로그인한 사람 정보

    if (!user) {
        alert("로그인해야 쓸 수 있습니다!");
        return;
    }
    if (msg.length < 2) {
        alert("너무 짧아요! 2글자 이상 써주세요.");
        return;
    }

    // 서버(Firestore)에 데이터 저장!
    db.collection("guestbook").add({
        name: user.email,     // 누가 썼는지
        message: msg,         // 무슨 내용인지
        date: new Date()      // 언제 썼는지
    })
    .then(() => {
        alert("방명록이 등록되었습니다!");
        msgInput.value = ""; // 입력창 비우기
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
        alert("오류가 났어요 ㅠㅠ");
    });
}

// 2. 방명록 실시간으로 불러오기 (마법의 기능 ✨)
// 페이지가 열리면 서버를 계속 감시합니다.
window.onload = function() {
    // 만약 로그인 안 했으면 로그인 창으로 쫓아냄
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            document.getElementById('username').innerText = user.email;
            
            // 여기서부터 데이터를 실시간으로 가져옵니다
            db.collection("guestbook").orderBy("date", "desc").onSnapshot((snapshot) => {
                const list = document.getElementById('guestbook-list');
                list.innerHTML = ""; // 기존 목록 싹 비우고 다시 그림

                snapshot.forEach((doc) => {
                    const data = doc.data();
                    // HTML 덩어리를 만들어서 끼워넣기
                    const html = `
                        <div class="card mb-2 p-2 shadow-sm">
                            <small class="text-primary fw-bold">${data.name}</small>
                            <span class="fs-5">${data.message}</span>
                        </div>
                    `;
                    list.innerHTML += html;
                });
            });

        } else {
            alert("로그인이 필요합니다.");
            location.href = 'index.html';
        }
    });
};