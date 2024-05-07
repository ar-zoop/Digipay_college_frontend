const userPhoneNumber = localStorage.getItem('phoneNumber')
const jwtToken = localStorage.getItem('jwtToken');

const errorMessageDiv = document.getElementById("errorMessage");
const container = document.getElementById("transactionBox")
const toastTrigger = document.getElementById('liveToastBtn')
const toastLiveExample = document.getElementById('liveToast')


const showTransactions = async (d) => {
	console.log(d)
	try {
		const response = await axios.request({
			method: 'POST',
			url: 'http://localhost:3000/api/v1/transactions/merchant',
			data: d,
			headers: { 'authorization': jwtToken }
		})

		if (response.status == 200 || response.status == 201 && transactionArray.length>0) {

			const transactionArray = response.data.data;
			console.log(transactionArray)

			let lastElement = transactionArray[transactionArray.length - 1];

			if(localStorage.getItem("latestTransaction") != lastElement.createdAt){
				//show a pop up
				
				localStorage.setItem("latestTransaction", lastElement.createdAt);

				var alertElement = document.getElementById('myAlert');
	
				// Remove the 'd-none' class to make it visible
				alertElement.classList.remove('d-none');	
			}
			
			for (i = transactionArray.length-1; i>=0 ; i--) {
				let userPhoneNumber = transactionArray[i].userPhoneNumber;
				let amount = transactionArray[i].amount;
				let transactionDate = transactionArray[i].date;
                let time = transactionArray[i].time;
                const transactionHtml = `
                <div>Amount: <span>${amount}</span></div>
                <div>Date & Time: <span>${transactionDate} ${time}</span></div>
                <div>Payment from: <span>${userPhoneNumber}</span></div>
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

setTimeout(function(){
	window.location.reload();
 }, 5000);