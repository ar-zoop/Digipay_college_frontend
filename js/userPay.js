const jwtToken = localStorage.getItem('jwtToken');
const userPhoneNumber = localStorage.getItem('phoneNumber')

const form = document.getElementById('form');
const errorMessageDiv = document.getElementById("error-message");
const merchantPhoneNumber = document.getElementById("merchantPhoneNumber");
const merchantInformationDiv = document.getElementById("merchant-information");
const voucherBox = document.getElementById("voucherBox")
const container = document.getElementById('radioContainer');
const verifyMerchant = document.getElementById("verifyMerchant");
const paymentBox = document.getElementById("paymentBox");
const chooseVoucher = document.getElementById("chooseVoucher");
const errorPayMessage = document.getElementById("errorPayMessage");
const successPayMessage = document.getElementById("successPayMessage");

var chosenVoucher ;
var voucherArrayWithMatchingPurpose = []

const verifyAndGetMerchant = async (merchantData, userData) => {
	console.log("verifyAndGetMerchant function called");
	try {
		console.log("data: ", merchantData)
		const response = await axios.request({
			method: 'POST',
			url: 'http://localhost:3000/api/v1/merchants',
			data: merchantData,
			headers: { 'authorization': jwtToken }
		})

		if (response.status == 201 || response.status == 200) {
			console.log(response.data.data.purpose)
			const merchantPurpose = response.data.data.purpose
			merchantInformationDiv.textContent = "Purpose of merchant : " + response.data.data.purpose;
			merchantInformationDiv.style.display = 'block';
			getAllVouchers(userData, merchantPurpose)
		}
		else {
			console.error('Error:', response.message);
			errorMessageDiv.textContent = response.message;
			errorMessageDiv.style.display = 'block';
		}
	}
	catch (error) {
		console.error("Error:", error)
		errorMessageDiv.textContent = error.message;
		errorMessageDiv.style.display = 'block';
	}
}

const getAllVouchers = async (userData, merchantPurpose) => {
	console.log(userData)
	try {
		const response = await axios.request({
			method: 'POST',
			url: 'http://localhost:3000/api/v1/vouchers/getVoucher',
			data: userData,
			headers: { 'authorization': jwtToken }
		})

		if (response.status == 200 || response.status == 201) {

			const voucherArray = response.data.data;
			console.log(voucherArray)
			
			for (i = 0; i < voucherArray.length; i++) {
				if (voucherArray[i].purpose == merchantPurpose && voucherArray[i].amount >= 0) {
					voucherArrayWithMatchingPurpose.push(voucherArray[i])
				}
			}
			console.log(voucherArrayWithMatchingPurpose)
			if (voucherArrayWithMatchingPurpose.length > 0) {
				//SHOW THE NEXT BLOCK - show purpose based voucher only
				voucherBox.style.display = 'block';
				let voucherPurpose;
				let amount;
				let expiryDate;
				for (i = 0; i < voucherArrayWithMatchingPurpose.length; i++) {
					voucherPurpose = voucherArrayWithMatchingPurpose[i].purpose;
					amount = voucherArrayWithMatchingPurpose[i].amount;
					expiryDate = voucherArrayWithMatchingPurpose[i].expiryDate;
					const radioHtml = `
			<div class="form-check">
			<input class="mb-3 form-check-input" type="radio" id="option${i}" value="${i}" name="voucherOption">
			<label class="form-check-label" for="option0">
				<div>Voucher Purpose: <span>${voucherPurpose}</span></div>
				<div>Amount: <span>${amount}</span></div>
				<div>Expiry Date: <span>${expiryDate}</span></div>
			</label><hr>

		</div>
		`
					container.innerHTML += radioHtml;
				}
			}
			else {
				//SHOW THE NEXT BLOCK -  say no vouchers available
				voucherBox.textContent = "No vouchers found. Request a voucher."
				voucherBox.style.display = 'BLOCK';
			}
		}
	}
	catch (error) {
		console.error("Error:", error)
		errorMessageDiv.textContent = error.message;
		errorMessageDiv.style.display = 'BLOCK';
	}
}

const makePayment = async (d) => {
	const amount = d.amount
	const pin = d.pincode
	console.log(chosenVoucher);
	console.log("amount : ", amount)
	console.log("pin: ", pin)
	if (amount > chosenVoucher.amount) {
		errorPayMessage.textContent = "Not enough balance in voucher. Choose another voucher and try again."
		errorPayMessage.style.display = 'BLOCK';
	}
	else {
		try {

			//HIT AN API TO DO MONEY DEDUCTION
			const response = await axios.request({
				method: 'POST',
				url: 'http://localhost:3000/api/v1/transactions/pay',
				data: d,
				headers: { 'authorization': jwtToken }
			})

			if (response.status == 200 || response.status == 201) {
				successPayMessage.textContent = "Payment successful."
				successPayMessage.style.display = 'BLOCK';
			}
			else {
				errorPayMessage.textContent = "Payment failed."
				errorPayMessage.style.display = 'BLOCK';
			}
		}
		catch (error) {
			errorPayMessage.textContent = error.message
			errorPayMessage.style.display = 'BLOCK';
		}

	}
}

verifyMerchant.addEventListener("click", (e) => {
	e.preventDefault();
	let merchantData = {
		phoneNumber: merchantPhoneNumber.value
	}
	let userData = {
		phoneNumber: userPhoneNumber
	}
	console.log("merchant data :", merchantData)
	verifyAndGetMerchant(merchantData, userData)
});

chooseVoucher.addEventListener("click", (e) => {
	e.preventDefault();
	let selectedOption = document.querySelector('input[name="voucherOption"]:checked');
	console.log("index of selected voucher  : ", selectedOption.value)
	chosenVoucher = voucherArrayWithMatchingPurpose[selectedOption.value]
	paymentBox.style.display = 'BLOCK';
})

pay.addEventListener("click", (e) => {
	e.preventDefault();
	let d= {
		phoneNumber : userPhoneNumber,
		pincode : document.getElementById("pin").value,      
		amount: document.getElementById("amount").value,
		voucherId: chosenVoucher.voucherId,
		merchantPhoneNumber: merchantPhoneNumber.value
	}
	console.log("data object: ", d)
	makePayment(d);
})