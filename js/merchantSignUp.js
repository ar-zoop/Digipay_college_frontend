const phoneNumberInput = document.getElementById("phoneNumber");
const passwordInput = document.getElementById("password");
const purposeInput = document.getElementById("purpose");
const form = document.getElementById('form-signUp');
const errorMessageDiv = document.getElementById("error-message");

const signUp = async (data) => {
    console.log("signUp function called", data);
    try {
        const response = await axios.post('http://localhost:3000/api/v1/merchants/signup', data);
        console.log("Response status:", response.status);
        if (response.status === 200 || response.status === 201) {
            console.log("Sign up successful");
            console.log("Redirecting to merchantsignin.html...");
            window.location.href = 'mer_signin.html';
        }
    } catch (error) {
        console.error("Error:", error);
        errorMessageDiv.textContent = error.message;
        errorMessageDiv.style.display = 'block';
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let data = {
        phoneNumber: phoneNumberInput.value,
        password: passwordInput.value,
        purpose: purposeInput.value // Convert pincode to integer
    };
    console.log("data:", data);
    signUp(data);
});
