'use client';

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Import the useRouter hook

const User = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [errors, setErrors] = useState({});
    const router = useRouter(); // Initialize the useRouter hook

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateInputs = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email.";
        }

        if (!formData.password) {
            newErrors.password = "Password is required.";
        } else if (
            !/(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}/.test(
                formData.password
            )
        ) {
            newErrors.password =
                "Password must be at least 8 characters long, include a number, an uppercase letter, and a special character.";
        }

        if (!isLogin && !formData.name) {
            newErrors.name = "Full name is required for signup.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateInputs()) {
            return;
        }

        const endpoint = isLogin ? "/login" : "/signup"; // Choose the correct endpoint
        const url = `http://localhost:4000${endpoint}`; // Backend API URL

        try {
            // Make the POST request
            const response = await axios.post(url, formData);

            if (response.status === 200) {
                alert(response.data.message); // Display success message
                localStorage.setItem("user", JSON.stringify(formData)); // Store user data in localStorage
                localStorage.setItem("email", JSON.stringify(formData.email));

                // Navigate the user to the /home page after successful login
                if (isLogin) {
                    router.push("/home"); // Navigate to /home
                }
            }
        } catch (error) {
            // Handle errors
            if (error.response) {
                alert(`Error: ${error.response.data.message || "Something went wrong!"}`);
                console.error("Response Error:", error.response);
            } else if (error.request) {
                alert("No response received from the server!");
                console.error("Request Error:", error.request);
            } else {
                alert("Error occurred while making the request!");
                console.error("Error:", error.message);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-400 p-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
                {/* Tab Switcher */}
                <div className="flex justify-between mb-6 gap-4">
                    <button
                        className={`w-1/2 text-center py-2 rounded-lg font-semibold transition ${
                            isLogin ? "bg-orange-500 text-black" : "bg-gray-200 text-gray-600"
                        }`}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        className={`w-1/2 text-center py-2 rounded-lg font-semibold transition ${
                            !isLogin ? "bg-orange-500 text-black" : "bg-gray-200 text-gray-600"
                        }`}
                        onClick={() => setIsLogin(false)}
                    >
                        Signup
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                                placeholder="Enter your name"
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                            placeholder="Enter your email"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition"
                    >
                        {isLogin ? "Login" : "Signup"}
                    </button>
                </form>

                {/* Extra Options */}
                {isLogin && (
                    <p className="text-center text-sm text-gray-600 mt-4">
                        Don't have an account?{" "}
                        <span
                            className="text-orange-500 cursor-pointer"
                            onClick={() => setIsLogin(false)}
                        >
                            Sign up
                        </span>
                    </p>
                )}
            </div>
        </div>
    );
};

export default User;

