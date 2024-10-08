import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { signupUser } from "../store/authSlice";
import { Input, Button } from "../component";
import { useLocation, useNavigate } from "react-router-dom";





export default function ContactForm() {
    const [isSigning, setIsSigning] = useState(false);
    const [showError, setShowError] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const location = useLocation();
    //   const { type } = location.state || {}; // Get the type passed from modal
    //   localStorage.setItem("userType", type);






    // Prevent numbers in text fields
    const handleNameKeyPress = (e) => {
        const charCode = e.keyCode || e.which;
        const charStr = String.fromCharCode(charCode);
        if (!/^[a-zA-Z]+$/.test(charStr)) {
            e.preventDefault();
        }
    };

    // Prevent non-numeric input in phone number and limit length
    const handlePhoneKeyPress = (e) => {
        const charCode = e.keyCode || e.which;
        const charStr = String.fromCharCode(charCode);
        if (!/^[0-9]+$/.test(charStr)) {
            e.preventDefault();
        }
    };
    const handleSignup = async (data) => {
        console.log(data, 'data');

    }
    return (
        <form onSubmit={handleSubmit(handleSignup)} className="mt-8">
            <div className="mt-2">
                <span className="mb-6 flex space-x-2">
                    <Input
                        mainInput={"sm:w-full w-full"}
                        label="Full Name"
                        type="text"
                        placeholder="John"
                        onKeyPress={handleNameKeyPress} // Prevent numbers
                        {...register("name", {
                            pattern: {
                                value: /^[A-Za-z]+$/,
                                message: "First name should contain only alphabets",
                            },
                        })}
                    />
                    {errors.fname && (
                        <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                    )}
                    <span className="w-full">
                        <Input
                            mainInput={"sm:w-full w-full"}
                            label="Email"
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                    message: "Enter a valid email address",
                                },
                            })}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </span>
                </span>


                <Button
                    type="submit"
                    className={`w-full ${isSigning ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                    disabled={isSigning}
                >
                    {isSigning ? "Connectin..." : "Connect"}
                </Button>
            </div>
        </form>
    );
}
