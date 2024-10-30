const form = document.querySelector(".mort-form");
const formNumInputs = [...document.querySelectorAll(`input[type="text"]`)];
const formRadInputs = [...document.querySelectorAll(`input[type="radio"]`)];
const formResults = document.querySelector(".form-results");
const monthlyRepayment = document.querySelector(".monthly-repayment");
const termRepayment = document.querySelector(".term-repayment");
const radInputContainer = document.querySelector(".radio-container");
const clearAllBtn = document.querySelector(".clearAll-btn");

formNumInputs.forEach((input) => {
  input.addEventListener("input", () => {
    input.parentElement.classList.remove("show-input-error");
  });
});

let mortgageType;
formRadInputs.forEach((radInput) => {
  radInput.addEventListener("change", () => {
    if (radInput.checked) {
      mortgageType = radInput.value;
      radInputContainer.classList.remove("show-input-error");
    }
  });
});

form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  let amount;
  let term;
  let interestRate;

  // Validation
  formNumInputs.forEach((input) => {
    const value = input.value;
    let checkValue = value / 1;
    checkValue = Number.isNaN(checkValue, NaN);
    if (!value) {
      input.parentElement.classList.add("show-input-error");
      input.nextElementSibling.nextElementSibling.textContent =
        "This field is required";
    } else {
      if (checkValue) {
        input.parentElement.classList.add("show-input-error");
        input.nextElementSibling.nextElementSibling.textContent =
          "Please enter a valid number";
      } else if (value <= 0) {
        input.parentElement.classList.add("show-input-error");
        input.nextElementSibling.nextElementSibling.textContent =
          "Value must be greater than zero(0)";
      } else {
        if (input.classList.contains("amt-input")) amount = value;
        else if (input.classList.contains("term-input")) term = value;
        else interestRate = value;
      }
    }
  });
  if (!mortgageType) radInputContainer.classList.add("show-input-error");

  // Mortgage Calc
  if (amount && term && interestRate && mortgageType)
    calculateMortgage(amount, term, interestRate, mortgageType);
});

// Mortgage Calc Function
const calculateMortgage = (amount, term, interest, type) => {
  interest = interest / 100 / 12;
  const paymentMonths = term * 12;
  const mortgageCalc =
    (amount * interest * Math.pow(1 + interest, paymentMonths)) /
    (Math.pow(1 + interest, paymentMonths) - 1);
  const repaymentTotal = mortgageCalc * paymentMonths;

  const interestTotal = repaymentTotal - amount;
  const interestPerMonth = interestTotal / paymentMonths;
  let termPayment;
  let monthlyPayment;
  if (type == "repayment") {
    termPayment = repaymentTotal;
    monthlyPayment = mortgageCalc;
  } else {
    termPayment = interestTotal;
    monthlyPayment = interestPerMonth;
  }

  formResults.classList.add("show");
  monthlyRepayment.textContent = `£${formatResult(monthlyPayment)}`;
  termRepayment.textContent = `£${formatResult(termPayment)}`;
};

const formatResult = (price) => {
  let formattedResult = Intl.NumberFormat().format(price.toFixed(2));
  return formattedResult;
};

clearAllBtn.addEventListener("click", () => {
  formResults.classList.remove("show");
  mortgageType = "";
});
