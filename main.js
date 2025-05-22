const ADMIN_EMAIL = "datmtp12345@gmail.com";

const toggleModeBtn = document.getElementById("toggle-mode-btn");
const memberSection = document.getElementById("member-section");
const adminSection = document.getElementById("admin-section");
const adminLoginBtn = document.getElementById("admin-login-btn");
const memberLoginBtn = document.getElementById("member-login-btn");
const adminEmailInput = document.getElementById("admin-email");
const adminPanel = document.getElementById("admin-panel");
const currentCodeDisplay = document.getElementById("current-code-display");
const newCodeInput = document.getElementById("new-code-input");
const changeCodeBtn = document.getElementById("change-code-btn");
const toggleAutoBtn = document.getElementById("toggle-auto-btn");
const autoState = document.getElementById("auto-state");
const codeInput = document.getElementById("code-input");
const backToMemberBtn = document.getElementById("back-to-member-btn");

let loggedInAsAdmin = false;
let autoChangeInterval = null;
let autoChanging = true;

let loginCode = "";

db.ref("loginCode")
  .once("value")
  .then((snapshot) => {
    const code = snapshot.exists() ? snapshot.val() : "";

    loginCode = code;

    console.log("Loaded loginCode:", loginCode);
  })
  .catch((error) => {
    console.error("Error fetching loginCode:", error);
  });

function initCode() {
  if (loginCode !== "") {
    db.ref("loginCode").set(generateRandomCode());
  }
}

function generateRandomCode() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

function updateCodeDisplay() {
  currentCodeDisplay.textContent = loginCode || "";
}

function startAutoChange() {
  if (autoChangeInterval) clearInterval(autoChangeInterval);
  autoChangeInterval = setInterval(() => {
    if (autoChanging) {
      const newCode = generateRandomCode();
      db.ref("loginCode").set(newCode);
      updateCodeDisplay();
      console.log("Mã tự động đổi thành:", newCode);
    }
  }, 60000);
  autoChanging = true;
  autoState.textContent = "Đang chạy";
  toggleAutoBtn.textContent = "Dừng tự động đổi mã";
}

function stopAutoChange() {
  autoChanging = false;
  autoState.textContent = "Đã dừng";
  toggleAutoBtn.textContent = "Tiếp tục tự động đổi mã";
}

toggleAutoBtn.onclick = () => {
  if (autoChanging) {
    stopAutoChange();
  } else {
    autoChanging = true;
    autoState.textContent = "Đang chạy";
    toggleAutoBtn.textContent = "Dừng tự động đổi mã";
  }
};

changeCodeBtn.onclick = () => {
  const newCode = newCodeInput.value.trim();
  if (!newCode) {
    alert("Vui lòng nhập mã mới.");
    return;
  }
  db.ref("loginCode").set(newCode);
  updateCodeDisplay();
  alert("Mã đã được cập nhật!");
  newCodeInput.value = "";
};

adminLoginBtn.onclick = () => {
  const email = adminEmailInput.value.trim().toLowerCase();
  if (email === ADMIN_EMAIL) {
    loggedInAsAdmin = true;
    alert("Đăng nhập Admin thành công!");
    adminPanel.style.display = "block";
    adminEmailInput.disabled = true;
    adminLoginBtn.disabled = true;
    toggleModeBtn.style.display = "none";
    updateCodeDisplay();
    startAutoChange();
  } else {
    alert("Email không đúng, bạn không phải admin!");
  }
};

memberLoginBtn.onclick = () => {
  const inputCode = codeInput.value.trim();
  const currentCode = loginCode;
  if (!inputCode) {
    alert("Vui lòng nhập mã đăng nhập.");
    return;
  }
  if (inputCode === currentCode) {
    alert("Đăng nhập thành viên thành công!");
    localStorage.setItem("loggedIn", "member");
    window.location.href = "main.html";
  } else {
    alert("Mã đăng nhập không đúng!");
  }
};

toggleModeBtn.onclick = () => {
  if (memberSection.style.display !== "none") {
    memberSection.style.display = "none";
    adminSection.style.display = "block";
    toggleModeBtn.textContent = "Chuyển sang chế độ Thành viên";
  } else {
    memberSection.style.display = "block";
    adminSection.style.display = "none";
    toggleModeBtn.textContent = "Chuyển sang chế độ Admin";
  }
};

backToMemberBtn.onclick = () => {
  loggedInAsAdmin = false;
  adminPanel.style.display = "none";
  adminEmailInput.disabled = false;
  adminEmailInput.value = "";
  adminLoginBtn.disabled = false;
  toggleModeBtn.style.display = "inline-block";
  adminSection.style.display = "none";
  memberSection.style.display = "block";
  toggleModeBtn.textContent = "Chuyển sang chế độ Admin";
};

window.onload = () => {
  initCode();
  updateCodeDisplay();
};

db.ref("loginCode").on("value", snapshot => {
  const data = snapshot.val();
  if (data) {
    loginCode = data;
    updateCodeDisplay();
  }
});
