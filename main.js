// Các phần tử DOM
const toggleModeBtn = document.getElementById("toggle-mode-btn");
const memberSection = document.getElementById("member-section");
const adminSection = document.getElementById("admin-section");

const memberLoginBtn = document.getElementById("member-login-btn");
const codeInput = document.getElementById("code-input");

const adminLoginBtn = document.getElementById("admin-login-btn");
const adminEmailInput = document.getElementById("admin-email");

const adminPanel = document.getElementById("admin-panel");
const currentCodeDisplay = document.getElementById("current-code-display");
const newCodeInput = document.getElementById("new-code-input");
const changeCodeBtn = document.getElementById("change-code-btn");
const toggleAutoBtn = document.getElementById("toggle-auto-btn");
const autoStateSpan = document.getElementById("auto-state");
const backToMemberBtn = document.getElementById("back-to-member-btn");

// Biến trạng thái
let currentCode = "123456";
let autoChangeCode = true;
let autoChangeInterval = null;

// Cập nhật mã trong Firebase
function updateCodeInFirebase(newCode) {
  return db.ref("attendanceCode").set(newCode);
}

// Lấy mã từ Firebase
function getCodeFromFirebase() {
  return db.ref("attendanceCode").once("value").then(snapshot => snapshot.val());
}

// Hiển thị mã hiện tại lên UI
function displayCurrentCode() {
  currentCodeDisplay.textContent = currentCode;
}

// Tự động đổi mã mỗi 60 giây
function startAutoChangeCode() {
  if (autoChangeInterval) clearInterval(autoChangeInterval);
  autoChangeInterval = setInterval(async () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    currentCode = newCode;
    await updateCodeInFirebase(newCode);
    displayCurrentCode();
    console.log("Mã điểm danh tự động đổi thành: " + newCode);
  }, 60000);

  autoStateSpan.textContent = "Đang chạy";
  toggleAutoBtn.textContent = "Dừng tự động đổi mã";
  autoChangeCode = true;
}

// Tắt tự động đổi mã
function stopAutoChangeCode() {
  if (autoChangeInterval) clearInterval(autoChangeInterval);
  autoChangeInterval = null;
  autoStateSpan.textContent = "Đã dừng";
  toggleAutoBtn.textContent = "Bật lại tự động đổi mã";
  autoChangeCode = false;
}

// Khởi tạo ban đầu
async function init() {
  const codeFromDB = await getCodeFromFirebase();
  if (codeFromDB) currentCode = codeFromDB;
  displayCurrentCode();

  const auto = localStorage.getItem("autoChangeCode");
  autoChangeCode = auto !== "false"; // mặc định bật
  autoChangeCode ? startAutoChangeCode() : stopAutoChangeCode();
}

// Chuyển đổi chế độ
toggleModeBtn.addEventListener("click", () => {
  if (memberSection.style.display !== "none") {
    memberSection.style.display = "none";
    adminSection.style.display = "block";
    toggleModeBtn.textContent = "Chuyển sang chế độ Thành viên";
  } else {
    memberSection.style.display = "block";
    adminSection.style.display = "none";
    adminPanel.style.display = "none";
    toggleModeBtn.textContent = "Chuyển sang chế độ Admin";
  }
});

// Đăng nhập thành viên
memberLoginBtn.addEventListener("click", async () => {
  const inputCode = codeInput.value.trim();
  const latestCode = await getCodeFromFirebase();

  if (inputCode === latestCode) {
    alert("Đăng nhập thành viên thành công!");
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("role", "member");
    window.location.href = "main.html";
  } else {
    alert("Mã đăng nhập không đúng, vui lòng thử lại.");
  }
});

// Đăng nhập admin
adminLoginBtn.addEventListener("click", () => {
  const email = adminEmailInput.value.trim();
  if (!email) {
    alert("Vui lòng nhập email Admin.");
    return;
  }
  alert("Đăng nhập Admin thành công!");
  localStorage.setItem("loggedIn", "true");
  localStorage.setItem("role", "admin");
  adminPanel.style.display = "block";
});

// Cập nhật mã thủ công
changeCodeBtn.addEventListener("click", async () => {
  const newCode = newCodeInput.value.trim();
  if (!newCode) {
    alert("Mã mới không được để trống!");
    return;
  }
  currentCode = newCode;
  await updateCodeInFirebase(newCode);
  displayCurrentCode();
  newCodeInput.value = "";
  alert("Cập nhật mã thành công!");
});

// Bật/tắt tự động đổi mã
toggleAutoBtn.addEventListener("click", () => {
  if (autoChangeCode) {
    stopAutoChangeCode();
    localStorage.setItem("autoChangeCode", "false");
  } else {
    startAutoChangeCode();
    localStorage.setItem("autoChangeCode", "true");
  }
});

// Quay lại Thành viên
backToMemberBtn.addEventListener("click", () => {
  adminPanel.style.display = "none";
  adminSection.style.display = "none";
  memberSection.style.display = "block";
  toggleModeBtn.textContent = "Chuyển sang chế độ Admin";
});

// Chạy khởi tạo
init();
