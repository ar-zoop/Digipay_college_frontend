const phoneNumber = document.getElementById("phoneNumber")
const password = document.getElementById("password") 
const form = document.getElementById('form-signin');
const errorMessageDiv = document.getElementById("error-message");

const signIn =  async(d) => {
    console.log("signIn function called");
    try{
        const response = await axios.request({
            method : 'POST',
            url : 'http://localhost:3000/api/v1/merchant/signIn',
            data : d
        })
        console.log(response)
        if (response.status == 200 ){
            console.log("Login successful");
            const jwtToken = json.response.response;
            localStorage.setItem('jwtToken', jwtToken);
            localStorage.setItem('phoneNumber', response.phoneNumber);
            window.location.href = 'dashboard.html';  
        }
        else{
            console.error('Sign in failed:', response.message);
            errorMessageDiv.textContent = response.message; 
            errorMessageDiv.style.display = 'block'; 
        }
    }
    catch (error){
        console.error("Error:", error)
        errorMessageDiv.textContent = error.message; 
        errorMessageDiv.style.display = 'block'; 
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