// main.js

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

// Biến lưu trạng thái mã và tự động đổi mã
let currentCode = localStorage.getItem("attendanceCode") || "123456"; // mã mặc định
let autoChangeCode = (localStorage.getItem("autoChangeCode") === "true") || true;
let autoChangeInterval = null;

// Hiển thị mã hiện tại lên UI
function displayCurrentCode() {
  currentCodeDisplay.textContent = currentCode;
}

// Lưu mã mới vào localStorage và cập nhật UI
function updateCode(newCode) {
  if (!newCode || newCode.trim().length === 0) {
    alert("Mã mới không được để trống!");
    return;
  }
  currentCode = newCode.trim();
  localStorage.setItem("attendanceCode", currentCode);
  displayCurrentCode();
  alert("Cập nhật mã thành công!");
}

// Tự động đổi mã (ví dụ cứ 1 phút đổi một lần)
function startAutoChangeCode() {
  if (autoChangeInterval) clearInterval(autoChangeInterval);
  autoChangeInterval = setInterval(() => {
    // Đổi mã ngẫu nhiên 6 chữ số
    currentCode = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem("attendanceCode", currentCode);
    displayCurrentCode();
    console.log("Mã điểm danh đã tự động đổi thành: " + currentCode);
  }, 60000); // 60 giây

  autoStateSpan.textContent = "Đang chạy";
  toggleAutoBtn.textContent = "Dừng tự động đổi mã";
  autoChangeCode = true;
  localStorage.setItem("autoChangeCode", "true");
}

function stopAutoChangeCode() {
  if (autoChangeInterval) clearInterval(autoChangeInterval);
  autoChangeInterval = null;
  autoStateSpan.textContent = "Đã dừng";
  toggleAutoBtn.textContent = "Bật lại tự động đổi mã";
  autoChangeCode = false;
  localStorage.setItem("autoChangeCode", "false");
}

// Khởi tạo UI theo trạng thái lưu trữ
function init() {
  displayCurrentCode();

  if (autoChangeCode) {
    startAutoChangeCode();
  } else {
    stopAutoChangeCode();
  }
}

// Xử lý chuyển đổi chế độ Thành viên / Admin
toggleModeBtn.addEventListener("click", () => {
  if (memberSection.style.display !== "none") {
    // Chuyển sang Admin
    memberSection.style.display = "none";
    adminSection.style.display = "block";
    toggleModeBtn.textContent = "Chuyển sang chế độ Thành viên";
  } else {
    // Chuyển sang Thành viên
    memberSection.style.display = "block";
    adminSection.style.display = "none";
    adminPanel.style.display = "none"; // ẩn luôn panel admin khi chuyển về
    toggleModeBtn.textContent = "Chuyển sang chế độ Admin";
  }
});

// Đăng nhập thành viên với mã
memberLoginBtn.addEventListener("click", () => {
  const inputCode = codeInput.value.trim();
  if (inputCode === currentCode) {
    alert("Đăng nhập thành viên thành công!");
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("role", "member");
    window.location.href = "main.html";  // chuyển đến trang chính
  } else {
    alert("Mã đăng nhập không đúng, vui lòng thử lại.");
  }
});

// Đăng nhập Admin với email (ví dụ đơn giản, bạn có thể thêm xác thực thật)
adminLoginBtn.addEventListener("click", () => {
  const email = adminEmailInput.value.trim();
  if (!email) {
    alert("Vui lòng nhập email Admin.");
    return;
  }
  // Ở đây bạn có thể check email admin hợp lệ (ví dụ check danh sách email)
  // Tạm thời mình cho phép mọi email không rỗng đăng nhập admin
  alert("Đăng nhập Admin thành công!");
  localStorage.setItem("loggedIn", "true");
  localStorage.setItem("role", "admin");
  adminPanel.style.display = "block";
});

// Cập nhật mã thủ công
changeCodeBtn.addEventListener("click", () => {
  const newCode = newCodeInput.value.trim();
  updateCode(newCode);
  newCodeInput.value = "";
});

// Bật/tắt tự động đổi mã
toggleAutoBtn.addEventListener("click", () => {
  if (autoChangeCode) {
    stopAutoChangeCode();
  } else {
    startAutoChangeCode();
  }
});

// Quay lại phần Thành viên từ Admin panel
backToMemberBtn.addEventListener("click", () => {
  adminPanel.style.display = "none";
  adminSection.style.display = "none";
  memberSection.style.display = "block";
  toggleModeBtn.textContent = "Chuyển sang chế độ Admin";
});

init();
