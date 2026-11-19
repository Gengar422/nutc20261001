const form = document.querySelector("#payment-form");
const cardInput = document.querySelector("#card-number");
const expiryInput = document.querySelector("#expiry");
const cvvInput = document.querySelector("#cvv");
const amountInput = document.querySelector("#amount");
const result = document.querySelector("#result");

function showFieldError(input, text) {
  if (!input) return;
  const field = input.closest(".field");
  if (!field) return;

  field.classList.add("invalid");
  const errorEl = field.querySelector(".error");
  if (errorEl) {
    errorEl.textContent = text;
  }
}

function clearErrors() {
  document.querySelectorAll(".field").forEach(function (field) {
    field.classList.remove("invalid");
    const errorEl = field.querySelector(".error");
    if (errorEl) {
      errorEl.textContent = "";
    }
  });
}

function isEmpty(value) {
  return value.trim() === "";
}

// Luhn 演算法檢查（return 必須放在 for 迴圈外面）
function passesLuhn(cardNumber) {
  const digits = cardNumber.replace(/\s+/g, "");
  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);

    if (shouldDouble) {
      digit = digit * 2;
      if (digit > 9) {
        digit = digit - 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

// 專門檢查測試卡號：空白 -> 請勿空白 / 非16位數字 -> 卡號長度不對 / Luhn不通過 -> 請輸入正確的卡號
function validateCardNumber() {
  const rawValue = cardInput.value;
  const digits = rawValue.replace(/\s+/g, "");

  if (isEmpty(rawValue)) {
    showFieldError(cardInput, "請勿空白");
    return false;
  }

  if (!/^\d{16}$/.test(digits)) {
    showFieldError(cardInput, "卡號長度不對");
    return false;
  }

  if (!passesLuhn(digits)) {
    showFieldError(cardInput, "請輸入正確的卡號");
    return false;
  }

  return true;
}

function validateFields() {
  let isValid = true;

  // 1. 測試卡號
  if (!validateCardNumber()) {
    isValid = false;
  }

  // 2. 有效期限
  const expiryValue = expiryInput.value.trim();
  if (isEmpty(expiryValue)) {
    showFieldError(expiryInput, "請勿空白");
    isValid = false;
  } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryValue)) {
    showFieldError(expiryInput, "請使用 MM/YY，月份需為 01 到 12");
    isValid = false;
  }

  // 3. 安全碼
  const cvvValue = cvvInput.value.trim();
  if (isEmpty(cvvValue)) {
    showFieldError(cvvInput, "請勿空白");
    isValid = false;
  } else if (!/^\d{3}$/.test(cvvValue)) {
    showFieldError(cvvInput, "請輸入 3 位數字");
    isValid = false;
  }

  // 4. 付款金額
  const amountRaw = amountInput.value.trim();
  const amount = Number(amountRaw);
  if (isEmpty(amountRaw)) {
    showFieldError(amountInput, "請勿空白");
    isValid = false;
  } else if (!Number.isFinite(amount) || amount < 1 || amount > 50000) {
    showFieldError(amountInput, "金額必須介於 1 到 50000");
    isValid = false;
  }

  return isValid;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  clearErrors();

  if (validateFields()) {
    result.textContent = "所有欄位格式通過";
    result.className = "result";
  } else {
    result.textContent = "請修正欄位錯誤";
    result.className = "result failed";
  }
});