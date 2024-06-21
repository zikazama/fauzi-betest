function generateAccountNumber() {
  const timestamp = Date.now().toString(); // Get current timestamp
  const randomPart = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0"); // Generate a random 6-digit number
  const uniqueNumber = timestamp + randomPart; // Combine timestamp and random part
  return uniqueNumber.slice(0, 16); 
}

module.exports = generateAccountNumber;
