const phoneNumber = document.getElementById("phoneNumber")
const password = document.getElementById("password") 
const form = document.getElementById('form-signin');
const errorMessageDiv = document.getElementById("error-message");

const signIn =  async(d) => {
    console.log("signIn function called");
    try{
        const response = await axios.request({
            method : 'POST',
            url : 'http://localhost:3000/api/v1/merchants/signin',
            data : d
        })
        console.log(response)
        if (response.status == 200 || response.status==201){
            console.log("Login successful");
            console.log(response)
            const jwtToken = response.data.data;
            localStorage.setItem('jwtToken', jwtToken);
            localStorage.setItem('phoneNumber', d.phoneNumber);
            window.location.href = 'm_payment_history.html';  
        }
        else{
            console.error('Sign in failed:', response.message);
            errorMessageDiv.textContent = response.message; 
            errorMessageDiv.style.display = 'BLOCK'; 
        }
    }
    catch (error){
        console.error("Error:", error)
        errorMessageDiv.textContent = error.message; 
        errorMessageDiv.style.display = 'BLOCK'; 
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let data = {
        phoneNumber : phoneNumber.value,
        password : password.value
    }
    console.log("data :", data)
    signIn(data)
});