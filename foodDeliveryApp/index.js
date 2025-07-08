const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
 const sendMail = require('./sendMail')
 const orderCode = require('./orderCode');
 const {connectDatabase,userModel} = require('./db');

app.use(express.json());
app.use(cors()); // Middleware for cross-origin requests

// Signup route
app.post("/signup", async(req, res) => {
    const { name, email, password } = req.body;
try {
    const alreadyExist =  await userModel.findOne({email:email
    })
    if(alreadyExist){
        return res.status(400).json({message:"user already exist"})
    }
    const newUser = await userModel.create({
        username: name,
        email:email, 
        password:password
    })
    if(!newUser){
        return res.status(500).json({message:"signup failed"})
    }
    res.status(200).json({
        message: "signup successfully",
        email: email,
        username: name,
        password: password
    });

} catch (error) {
    console.error("Error in signup", error);
}
  
    // You can add logic here to save the user in a database
    
});



// Login route
app.post("/login", async(req, res) => {
    const { email, password } = req.body;
    try {
        const findUser =  await userModel.findOne({
            email:email
        })
        if(!findUser){
            return res.status(400).json({message:"user not found"})
        }
        if(findUser.password !== password){
            return res.status(400).json({message:"password not matched"})
        }
        res.status(200).json({
            message: "User logged in successfully",
            email,
        });
    } catch (error) {
        console.error("Error in login", error);
    }

    // You can add logic here to validate the user with a database
    
});




app.post("/home", async (req, res) => {
    const { email, name, quantity, price } = req.body;

    const orderCodeValue = orderCode(); // Call the function to generate a new code
    const subject = "Welcome to Tasty Bites";
    const message = `Your order placed successfully:
    Item: ${name}
    Quantity: ${quantity}
    Price: $${price}
    Your order code is: ${orderCodeValue}`;

    if (!email || !message) {
        return res.status(400).json({ error: "Email and message are required" });
    }

    // Call the updated sendMail function
    const response = await sendMail(email, subject, message);

    if (response.success) {
        res.status(200).json({
            message: "Email sent successfully",
            info: response.info.response, // Include email info for debugging
            code: orderCodeValue, // Send back the generated code
        });
    } else {
        res.status(500).json({
            error: "Failed to send email",
            details: response.error, // Include error details
        });
    }
});


app.post('/order-status',async (req, res) => {
    const { email, status } = req.body;
    const subject = "Welcome to Tasty Bites";
    // Validate the incoming data
    if (!email || !status) {
        return res.status(400).json({ message: 'Email and status are required.' });
    }

    try {
        // Logic to handle the email and status (e.g., sending email to the user)
          await sendMail(email, subject, status);

        // Placeholder for actual email-sending logic
        // e.g., using a library like nodemailer to send an email

        return res.status(200).json({ message: 'Order status email sent successfully.' });
    } catch (error) {
        console.error('Error processing order status:', error);
        return res.status(500).json({ message: 'An error occurred while processing the request.' });
    }
});



// Start server
connectDatabase().then(()=>{
app.listen(4000, () => {
    console.log("Listening at port 4000");
});
})