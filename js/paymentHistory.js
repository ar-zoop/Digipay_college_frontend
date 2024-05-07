const userPhoneNumber = localStorage.getItem('phoneNumber')
const jwtToken = localStorage.getItem('jwtToken');

const errorMessageDiv = document.getElementById("errorMessage");
const container = document.getElementById("transactionBox")


const showTransactions = async (d) => {
	console.log(d)
	try {
		const response = await axios.request({
			method: 'POST',
			url: 'http://localhost:3000/api/v1/transactions',
			data: d,
			headers: { 'authorization': jwtToken }
		})

		if (response.status == 200 || response.status == 201) {

			const transactionArray = response.data.data;
			console.log(transactionArray)
			
			for (i = 0; i < transactionArray.length; i++) {
				let merchantPhoneNumber = transactionArray[i].merchantPhoneNumber;
				let amount = transactionArray[i].amount;
				let transactionDate = transactionArray[i].date;
                let time = transactionArray[i].time;
                let voucherId = transactionArray[i].voucherId;
                const transactionHtml = `
                <div>Amount: <span>${amount}</span></div>
                <div>Date & Time: <span>${transactionDate} ${time}</span></div>
                <div>Paid to: <span>${merchantPhoneNumber}</span></div>
                <hr>
                `
                container.innerHTML += transactionHtml;
				
			}
        } else {
            // DISPLAY NO TRANSACTIONS MADE
            errorMessageDiv.textContent = "No transactions made. Make a payment"
            errorMessageDiv.style.display = 'BLOCK';
        }
		
	} catch (error) {
		console.error("Error:", error)
		errorMessageDiv.textContent = error.message;
		errorMessageDiv.style.display = 'BLOCK';
	}
}


window.addEventListener("load", (e) => {
	// e.preventDefault();
	let d= {
		phoneNumber : userPhoneNumber,
	}
	console.log("data object: ", d)
	showTransactions(d);
})