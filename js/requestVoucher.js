const purpose = document.getElementById("purpose");
const amount = document.getElementById("amount");
const expiryDate = document.getElementById("expiryDate");
const form = document.getElementById('request-voucher');
const errorMessageDiv = document.getElementById('error-message');
const successMessageDiv = document.getElementById("success-message");
const userPhoneNumber = localStorage.getItem('phoneNumber');
const jwtToken = localStorage.getItem('jwtToken');

const signIn =  async(d) => {
    console.log("Request voucher function called");
    try{ 
        const response = await axios.request({
            method : 'POST',
            url : 'http://localhost:3000/api/v1/vouchers',
            data : d
        })
        console.log(response)
        if (response.status == 201 || response.status == 200 ){
            console.log("Request voucher successful");
            successMessageDiv.textContent = "Voucher requested successfully. Voucher added to myVoucher list."; 
            successMessageDiv.style.display = 'block'; 
        }
        else{
            console.error('Request Voucher failed : ', response.message);
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
        purpose : purpose.value,
        amount : amount.value,
        expiryDate: expiryDate.value,
        phoneNumber : userPhoneNumber
    }
    console.log("data :", data)
    signIn(data)
});