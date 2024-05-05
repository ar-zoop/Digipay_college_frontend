window.onload = function() {
	// Retrieve items from local storage
	var jwtToken = localStorage.getItem('jwtToken');
	var phoneNumber = localStorage.getItem('phoneNumber');

	// Log the values to the console
		console.log("Stored JWT Token: ", jwtToken);
	console.log("Stored Phone Number: ", phoneNumber);
};