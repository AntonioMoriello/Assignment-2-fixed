document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("#signup");
    const emailInput = form.querySelector("#email");
    const passwordInput = form.querySelector("#password");
    const retypePasswordInput = form.querySelector("#retype-password");
    const postalCodeInput = form.querySelector("#postalcode");
    const togglePassword = document.querySelector("#togglePassword");
    const modifyCitiesBtn = document.querySelector("#modify-cities");

    const EMAIL_REQUIRED = "Please enter your email";
    const EMAIL_INVALID = "Please enter a correct email address format";
    const PASSWORD_REQUIRED = "Please enter a password";
    const PASSWORD_INVALID = "Password must be at least 6 characters, include one uppercase letter, one number, and one special character";
    const PASSWORD_MISMATCH = "Passwords do not match";
    const POSTAL_CODE_REQUIRED = "Please enter your postal code";
    const POSTAL_CODE_INVALID = "Enter a valid Canadian postal code (e.g., A1A 1A1)";

    function showMessage(input, message, type) {
        const msg = input.parentNode.querySelector("small");
        msg.innerText = message;
        input.className = type ? "success" : "error";
        return type;
    }

    function showError(input, message) {
        return showMessage(input, message, false);
    }

    function showSuccess(input) {
        return showMessage(input, "", true);
    }

    function hasValue(input, message) {
        if (input.value.trim() === "") {
            return showError(input, message);
        }
        return showSuccess(input);
    }

    function validateEmail(input) {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return hasValue(input, EMAIL_REQUIRED) && showMessage(input, '', emailRegex.test(input.value.trim()), EMAIL_INVALID);
    }

    function validatePassword(input) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return hasValue(input, PASSWORD_REQUIRED) && showMessage(input, '', passwordRegex.test(input.value.trim()), PASSWORD_INVALID);
    }

    function validatePostalCode(input) {
        return hasValue(input, POSTAL_CODE_REQUIRED) && showMessage(input, '', /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(input.value.trim()), POSTAL_CODE_INVALID);
    }

    function checkPasswordsMatch(password, retypePassword) {
        if (password.value.trim() === retypePassword.value.trim()) {
            return showSuccess(retypePassword);
        } else {
            return showError(retypePassword, PASSWORD_MISMATCH);
        }
    }

    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
    });

    modifyCitiesBtn.addEventListener("click", function() {
        const citiesSelect = document.querySelector("#cities");
        citiesSelect.removeChild(citiesSelect.querySelector("option[value='New York City']"));
        const newOption = document.createElement("option");
        newOption.value = "Laval";
        newOption.text = "Laval";
        citiesSelect.appendChild(newOption);
        modifyCitiesBtn.style.display = "none";
    });

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        let emailValid = validateEmail(emailInput);
        let passwordValid = validatePassword(passwordInput);
        let postalCodeValid = validatePostalCode(postalCodeInput);
        let passwordsMatchValid = checkPasswordsMatch(passwordInput, retypePasswordInput);

        if (emailValid && passwordValid && postalCodeValid && passwordsMatchValid) {
            const dataString = `Email: ${emailInput.value}\nPassword: ${passwordInput.value}\nPostal Code: ${postalCodeInput.value}`;
            const dataBlob = new Blob([dataString], { type: 'text/plain' });
            const url = URL.createObjectURL(dataBlob);
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = 'user_data.txt';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);

            alert("Form submitted and data exported successfully.");
        }
    });
});
