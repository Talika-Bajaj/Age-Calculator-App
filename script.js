
const errors = document.getElementsByClassName('error');
const validErrors = document.querySelectorAll('.valid');
const inputs = document.querySelectorAll('.input');
const labels = document.querySelectorAll('.labels');
const ageBtn = document.getElementById('age');
const dispYear = document.getElementById('d-year');
const dispMon = document.getElementById('d-mon');
const dispDays = document.getElementById('d-days');

let d = new Date();

//DATE  
let day = document.getElementById('day');
let errorDate = document.getElementById('error-date');
let errorDay = document.getElementById('error-day');
const labelDay = document.querySelector('label[for="day"]');
const currDate = d.getDate();

//MONTH
let mon = document.getElementById('mon');
let errorMon = document.getElementById('error-mon');
const labelMon = document.querySelector('label[for="mon"]');
const currMon = d.getMonth() + 1;

//YEAR
let year = document.getElementById('year');
let errorYear = document.getElementById('error-year');
let errYear = document.getElementById('err-yr');
const labelYear = document.querySelector('label[for="year"]');
let currYear = d.getFullYear();

//Event Listener on button
ageBtn.addEventListener('click', () => {
    checkEmptyInputs()
    checkValues();
    currentDate(year.value, mon.value, day.value);
})

//To display errors
function displayError(errorElement, labelElement, inputElement) {
    errorElement.style.display = 'block';
    labelElement.style.color = 'hsl(0, 100%, 67%)';
    inputElement.style.borderColor = 'hsl(0deg 61.81% 71.14%)';
}

//To remove errors
function resetErrors(errorElement, labelElement, inputElement) {
    errorElement.style.display = 'none';
    labelElement.style.color = 'hsl(0, 1%, 44%)';
    inputElement.style.borderColor = 'hsl(0, 0%, 86%)';
}

//To check empty input fields
function checkEmptyInputs() {
    inputs.forEach((input, index) => {
        if (input.value.length === 0) {
            displayError(errors[index], labels[index], input);
        } else {
            resetErrors(errors[index], labels[index], input);
        }
    })

}

//To check the pattern of values
function checkValues() {
    var numbers = /^[0-9]+$/;

    inputs.forEach((input, index) => {
        if (input.value !== '') {
            if (input.value.length == 1) {
                displayError(validErrors[index], labels[index], input);
                return;
            }
            if (input.value.match(numbers)) {
                resetErrors(validErrors[index], labels[index], input)
                checkYear();
                checkMonth();
                calculateAge();
                checkDate(mon.value);
            } else {
                displayError(validErrors[index], labels[index], input)
                resetDisplay();
            }
        }
    })
}

//To reset content of age
function resetDisplay() {
    dispYear.textContent = '--';
    dispMon.textContent = '--';
    dispDays.textContent = '--';
    return;
}

//To check year
function checkYear() {
    // The length check for the year is performed first. If the year length is less than 4, it displays the error and returns immediately, preventing further checks.
    let errYr = document.getElementById('err-yr');
    if (year.value.trim() !== '' && year.value.length < 4) {
        displayError(errYr, labelYear, year);
        return;
    }

    if (year.value > currYear) {
        displayError(errorYear, labelYear, year);
    }
    else {
        errorYear.style.display = 'none';
    }
}

//To check month
function checkMonth() {
    if (mon.value > 12 || mon.value.length == 1) {
        displayError(errorMon, labelMon, mon);
        return;
    }

    inputs.forEach((input, index) => {
        if (year.value == currYear && mon.value > currMon) {
            displayError(errorMon, labels[index], input);
            resetDisplay();
        }
    })
}

//To checkDate
function checkDate(value) {
    //if days > 31 
    if (day.value > 31 || day.value.length == 1 || day.value.length > 2) {
        displayError(errorDay, labelDay, day);
    } else {
        errorDay.style.display = 'none';
    }

    //for 30 days months
    inputs.forEach((input, index) => {
        if ((value == '04' || value == '06' || value == '09' || value == '11') && day.value == 31) {
            displayError(errorDate, labels[index], input)
        } else if (value == '02' && (day.value == 30 || day.value == 31)) {
            displayError(errorDate, labels[index], input)
        } else {
            errorDate.style.display = 'none';
        }
    })

    //for leap year feb
    if (value == '02' && day.value == 29) {
        checkLeapYear(year.value);
    }

    if (year.value == currYear && mon.value == currMon & day.value > currDate) {
        resetDisplay();
        displayError(errorDate, labels[0], day);

    }
}

//To check Leap year
function checkLeapYear(year) {
    let condition = (year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0);
    inputs.forEach((input, index) => {
        if (!condition) {
            displayError(errorDate, labels[index], input);
        }
    })
}

//To check current Date
function currentDate(yr, mn, dt) {
    if (dt < 10) {
        dt = dt.substring(1);
    }

    if (mn < 10) {
        mn = mn.substring(1);
    }

    inputs.forEach((input, index) => {
        if ((yr == currYear) && (mn == currMon) && (dt > currDate)) {
            displayError(errorDate, labels[index], input);
            return;
        }
    })

    inputs.forEach((input, index) => {
        if ((yr == currYear) && (mn > currMon)) {
            displayError(errorMon, labels[index], input);
        }
    })
}

//To calculate and display age
function calculateAge() {
    let allErrors = document.querySelectorAll('.all-err');
    // .some method is used check if any error is displayed
    const anyErrorDisplayed = Array.from(allErrors).some(error => error.style.display === 'block');


    if (anyErrorDisplayed) {
        dispYear.textContent = '--';
        dispMon.textContent = '--';
        dispDays.textContent = '--';
        return; // Exit early if there's any error displayed
    }

    let calcYear = currYear - year.value;
    let calcMonth = currMon - mon.value;
    let calcDay = currDate - day.value;

    //IF calcD IS NEGATIVE
    if (calcDay < 0) {
        calcMonth--;
        const previousMonth = currMon - 1;
        const NoOfDays = new Date(year.value, previousMonth, 0).getDate();
        // creates a date object for the last day of the previous month and retrieves the number of days in that month.
        calcDay += NoOfDays;
    }

    //IF calM IS NEGATIVE
    if (calcMonth < 0) {
        calcYear--;
        calcMonth += 12;
    }

    dispYear.textContent = calcYear;
    dispMon.textContent = calcMonth;
    dispDays.textContent = calcDay;
}