function CodeOtp() {
    const number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    const len = number.length;
    let code = "";

    for (let i = 0; i < 6; i++) { // Generate a code of 6 digits
        code += number[Math.floor(Math.random() * len)];
    }

    return code;
}

module.exports = CodeOtp; // Export the function itself
