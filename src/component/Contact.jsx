import { useState } from "react";
import { useForm } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import { FaRegUser, FaRegEnvelope, FaPhone, FaPen, FaEnvelope, FaUser } from "react-icons/fa";
import Button from "./Button";
import Input from "./Input";
import { showErrorToast, showSuccessToast } from "../utils/Toast";
import { FaMessage } from "react-icons/fa6";
import { submitContactForm } from "../utils/Api";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const Contact = () => {
    const [isSigning, setIsSigning] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [showError, setShowError] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    // Function to handle reCAPTCHA
    const handleRecaptchaChange = (value) => {
        setRecaptchaToken(value);
        setShowError(null); // Clear previous errors when user completes reCAPTCHA
    };

    const onSubmit = async (data) => {
        if (!recaptchaToken) {
            setShowError("Please complete the reCAPTCHA.");
            return;
        }

        setIsSigning(true);
        try {
            await submitContactForm({ ...data, recaptchaToken });
            showSuccessToast("Message sent successfully!");
            reset(); // Clears all form fields after success
            setRecaptchaToken(null); // Reset reCAPTCHA
        } catch (error) {
            showErrorToast("Failed to send message. Please try again later.");
        } finally {
            setIsSigning(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <div className="flex flex-col sm:flex-row sm:space-x-2 mb-4">
                    <div className="w-full mb-4 sm:mb-0">
                        <Input
                            mainInput="w-full"
                            icon={FaUser}
                            iconColor="0000F8"
                            type="text"
                            placeholder="First Name"
                            {...register("firstName", {
                                required: "First name is required",
                                maxLength: { value: 255, message: "Max length is 255" },
                            })}
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div className="w-full">
                        <Input
                            mainInput="w-full"
                            icon={FaUser}
                            iconColor="0000F8"
                            type="text"
                            placeholder="Last Name"
                            {...register("lastName", {
                                required: "Last name is required",
                                maxLength: { value: 255, message: "Max length is 255" },
                            })}
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                    </div>
                </div>

                <div className="w-full mb-4">
                    <Input
                        mainInput="w-full"
                        icon={FaEnvelope}
                        iconColor="0000F8"
                        type="email"
                        placeholder="Email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                message: "Enter a valid email address",
                            },
                            maxLength: { value: 255, message: "Max length is 255" },
                        })}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div className="w-full mb-4">
                    <Input
                        mainInput="w-full"
                        icon={FaPhone}
                        iconColor="0000F8"
                        type="text"
                        placeholder="Mobile Number"
                        {...register("mobile", {
                            required: "Mobile number is required",
                            maxLength: { value: 20, message: "Max length is 20" },
                        })}
                    />
                    {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
                </div>

                <div className="w-full mb-4">
                    <Input
                        mainInput="w-full"
                        icon={FaPen}
                        iconColor="0000F8"
                        type="text"
                        placeholder="Subject"
                        {...register("subject", {
                            required: "Subject is required",
                            maxLength: { value: 255, message: "Max length is 255" },
                        })}
                    />
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                </div>

                <div className="w-full mb-4">
                    <div className="w-full p-3 border rounded-md relative">
                        <FaMessage className="size-4 text-tn_pink absolute top-4" />
                        <textarea
                            className="w-full border-none pl-6 outline-none"
                            rows="4"
                            placeholder="Your message"
                            {...register("message", { required: "Message is required" })}
                        ></textarea>
                    </div>

                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>

                {/* reCAPTCHA Section */}
                <div className="mb-6">
                    <ReCAPTCHA
                        sitekey={RECAPTCHA_SITE_KEY}
                        onChange={handleRecaptchaChange}
                    />
                    {showError && (
                        <p className="text-red-500 text-xs mt-1">{showError}</p>
                    )}
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className={`w-full ${isSigning ? "opacity-70 cursor-not-allowed" : ""}`}
                    disabled={isSigning}
                >
                    {isSigning ? "Sending..." : "Send Message"}
                </Button>
            </div>
        </form>
    );
};

export default Contact;
