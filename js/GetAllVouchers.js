const userPhoneNumber = localStorage.getItem('phoneNumber');
const jwtToken = localStorage.getItem('jwtToken');

const errorMessageDiv = document.getElementById("errorMessage");
const container = document.getElementById("vouchersBox");

const showVouchers = async (data) => {
    try {
        const response = await axios.request({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/vouchers/getVoucher',
            data: data,
            headers: { 'authorization': jwtToken }
        });

        if (response.status === 200 || response.status === 201) {
            const vouchersArray = response.data.data;
            
            if (vouchersArray.length > 0) {
                vouchersArray.forEach(voucher => {
                    const amount = voucher.amount;
                    const voucherDate = voucher.expiryDate;
                    const voucherId = voucher.voucherId;

                    const voucherContainer = document.createElement('div');
                    voucherContainer.style.width = "250px"; // Adjust width as needed
                    voucherContainer.style.height = "200px"; // Adjust height as needed
                    voucherContainer.style.backgroundColor = "#fff"; // Adjust background color as needed
                    voucherContainer.style.border = "1px solid #ccc"; // Adjust border as needed
                    voucherContainer.style.borderRadius = "10px"; // Adjust border radius as needed
                    voucherContainer.style.padding = "20px"; // Adjust padding as needed
                    voucherContainer.style.margin = "10px"; // Adjust margin as needed
                    voucherContainer.innerHTML = `
                        <div>Voucher ID: <span>${voucherId}</span></div>
                        <div>Amount: <span>${amount}</span></div>
                        <div>Expiry Date: <span>${voucherDate}</span></div>
                    `;
                    container.appendChild(voucherContainer);
                });
            } else {
                errorMessageDiv.textContent = "No vouchers made. Make a payment";
                errorMessageDiv.style.display = 'block';
            }
        }
    } catch (error) {
        console.error("Error:", error);
        errorMessageDiv.textContent = error.message;
        errorMessageDiv.style.display = 'block';
    }
}

window.addEventListener("load", (e) => {
    e.preventDefault();
    const data = {
        phoneNumber: userPhoneNumber,
    };
    showVouchers(data);
});
