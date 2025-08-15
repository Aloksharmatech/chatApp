import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { signInFields, signUpFields } from "../config/formSchema";
import {
  login,
  register,
  verify,
  clearError,
  clearMessage,
} from "../store/auth/auth-slice";
import image from "../assets/LoginSignUpImage.avif";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LoginSignUpPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error, message } = useSelector(
    (state) => state.auth
  );

  const [isLogin, setIsLogin] = useState(true);
  const [otpSend, setOtpSend] = useState(false);
  const fields = isLogin ? signInFields : signUpFields;

  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {})
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle handler
  const handleToggle = () => {
    const newFields = isLogin ? signUpFields : signInFields;
    setFormData(
      newFields.reduce((acc, newField) => {
        acc[newField.name] = "";
        return acc;
      }, {})
    );
    setIsLogin(!isLogin);
    setOtpSend(false);
  };

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(isLogin ? "Login Data:" : "Signup Data:", formData);

    if (isLogin) {
      if (!formData.email || !formData.password) {
        console.log("Both email and password required");
        return;
      }
      dispatch(login(formData));
    } else {
      if (!otpSend) {
        if (
          !formData.username ||
          !formData.email ||
          !formData.password ||
          !formData.confirmPassword
        ) {
          console.log("Every field is required...");
          return;
        }

        dispatch(register(formData));
        setOtpSend(true);
      } else {
        if (!formData.otp) {
          console.log("OTP is required");
          return;
        }
        dispatch(verify({ email: formData.email, otp: formData.otp }));
      }
    }
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearMessage());

      if (message.toLowerCase().includes("user registered successfully")) {
        setIsLogin(true);
        setOtpSend(false);

        // Reset form to login fields
        setFormData(
          signInFields.reduce((acc, field) => {
            acc[field.name] = "";
            return acc;
          }, {})
        );
      }
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [message, error, isAuthenticated, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2D5976] via-[#274f6b] to-[#1c3e56] px-4">
      <div className="w-full max-w-5xl min-h-[550px] bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] p-0 flex overflow-hidden">
        {/* LEFT IMAGE SECTION WITH OVERLAY */}
        <div className="w-1/2 hidden md:block relative">
          <img
            src={image}
            alt="Auth Visual"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1c3e56]/20 to-[#2D5976]/20 rounded-l-3xl mix-blend-multiply pointer-events-none"></div>
        </div>

        {/* FORM SECTION */}
        <div
          className="w-full md:w-1/2 p-10 flex flex-col justify-center items-center relative"
          style={{ perspective: 1000 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{ transformStyle: "preserve-3d" }}
              className="w-full"
            >
              <h2 className="text-white text-4xl font-bold text-center tracking-wide drop-shadow-sm mb-6">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {fields.map((field) => (
                  <div
                    className={`relative group ${
                      !otpSend && field.name === "otp" ? "hidden" : "block"
                    }`}
                    key={field.name}
                  >
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-cyan-500 group-focus-within:text-cyan-400 transition">
                      {<field.icon />}
                    </span>
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleChange}
                      disabled={
                        otpSend && field.name !== "otp"
                          ? true
                          : field.name === "otp" && !otpSend
                          ? true
                          : false
                      }
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4db2e7] transition backdrop-blur-md"
                    />
                  </div>
                ))}

                {isLogin && (
                  <div className="text-right text-sm">
                    <a href="#" className="text-cyan-400 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r from-[#4db2e7] to-[#317fa4] hover:from-[#66cfff] hover:to-[#2d759f] text-white font-semibold py-3 rounded-xl transition duration-200 ease-in-out shadow-lg hover:shadow-cyan-500/40 tracking-wide ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        ></path>
                      </svg>
                      <span>Loading...</span>
                    </div>
                  ) : isLogin ? (
                    "SIGN IN"
                  ) : (
                    "SIGN UP"
                  )}
                </button>
              </form>

              <p className="text-center text-gray-300 text-sm mt-6">
                {isLogin ? (
                  <>
                    Don’t have an account?{" "}
                    <button
                      onClick={handleToggle}
                      className="text-cyan-400 hover:underline font-medium transition-all"
                    >
                      SignUp
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={handleToggle}
                      className="text-cyan-400 hover:underline font-medium transition-all"
                    >
                      SignIn
                    </button>
                  </>
                )}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUpPage;
