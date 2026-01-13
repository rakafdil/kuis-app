import React, { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { ClipLoader } from "react-spinners";
import useAuth from "../hooks/useAuth";
import { AnimatePresence, motion } from "framer-motion";

function Auth() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);

  const {
    error,
    isLoading,
    isLogin,
    formData,
    passwordsMatch,
    handleChange,
    login,
    register,
    setIsLogin,
  } = useAuth();

  const isSubmitDisabled =
    isLoading || (!isLogin && (!passwordsMatch || !formData.email));

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center min-h-screen p-4 lg:p-0 py-20">
      <div className="w-full lg:w-1/2 px-4 lg:px-20 mb-8 lg:mb-0 text-center lg:text-left">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
          Welcome To Quiz App
        </h1>
        <p className="mt-4 text-gray-600 ">
          Test your knowledge with our interactive quiz platform
        </p>
      </div>

      <div className="flex flex-col bg-white shadow-lg rounded-lg lg:rounded-none p-5 lg:p-8 lg:px-36 lg:pt-20   gap-5 w-full lg:w-1/2 max-w-md lg:max-w-none h-screen">
        <motion.h2
          key={isLogin ? "login-title" : "register-title"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-xl lg:text-2xl font-semibold text-center"
        >
          {isLogin ? "Login to your account" : "Create a new account"}
        </motion.h2>

        {error && (
          <div className="bg-red-500 text-white p-2 text-sm rounded">
            {error}
          </div>
        )}

        <div className="relative flex bg-white rounded-lg border-gray-300 border">
          <div
            className={`absolute top-0 left-0 h-full w-1/2 bg-gray-100 transition-transform duration-300 ease-out ${
              isLogin ? "translate-x-0" : "translate-x-full"
            }`}
          />

          <button
            className={`relative z-10 w-full py-2 md:py-3 text-sm md:text-base font-medium cursor-pointer ${
              !isLogin ? "hover:bg-gray-50" : ""
            } transition-all duration-100`}
            onClick={() => setIsLogin(true)}
            disabled={isLogin}
          >
            Login
          </button>

          <button
            className={`relative z-10 w-full py-2 md:py-3 text-sm md:text-base font-medium cursor-pointer ${
              isLogin ? "hover:bg-gray-50" : ""
            } transition-all duration-100`}
            onClick={() => setIsLogin(false)}
            disabled={!isLogin}
          >
            Register
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={isLogin ? "login" : "register"}
            onSubmit={isLoading ? undefined : isLogin ? login : register}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col gap-4"
          >
            <div>
              <span className="text-sm md:text-base">Username</span>
              <input
                autoFocus
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 text-sm md:text-base transition-colors duration-200 ${
                  error ? "border-red-500" : ""
                }`}
                required
              />
            </div>

            <div>
              <span className="text-sm md:text-base">Password</span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 pr-10 text-sm md:text-base transition-all duration-200"
                  required
                />
                {showPassword ? (
                  <BsEye
                    className="absolute right-3 top-2.5 md:top-3 cursor-pointer transition-opacity duration-200 hover:opacity-70 text-gray-600"
                    onClick={() => setShowPassword((v) => !v)}
                  />
                ) : (
                  <BsEyeSlash
                    className="absolute right-3 top-2.5 md:top-3 cursor-pointer transition-opacity duration-200 hover:opacity-70 text-gray-600"
                    onClick={() => setShowPassword((v) => !v)}
                  />
                )}
              </div>
            </div>

            <div hidden={isLogin}>
              <span className="flex justify-between text-sm md:text-base">
                Repeat Password
                {formData.repeatPassword && !passwordsMatch && (
                  <span className="text-red-500 text-xs md:text-sm transition-all duration-200">
                    Passwords do not match
                  </span>
                )}
                {formData.repeatPassword && passwordsMatch && (
                  <span className="text-green-500 text-xs md:text-sm transition-all duration-200">
                    Passwords match
                  </span>
                )}
              </span>
              <div className="relative">
                <input
                  type={showRepeat ? "text" : "password"}
                  name="repeatPassword"
                  value={formData.repeatPassword}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 pr-10 text-sm md:text-base transition-all duration-200 ${
                    formData.repeatPassword && !passwordsMatch
                      ? "border-red-500"
                      : formData.repeatPassword && passwordsMatch
                      ? "border-green-500"
                      : ""
                  }`}
                  required={!isLogin}
                />
                {showRepeat ? (
                  <BsEye
                    className="absolute right-3 top-2.5 md:top-3 cursor-pointer transition-opacity duration-200 hover:opacity-70 text-gray-600"
                    onClick={() => setShowRepeat((v) => !v)}
                  />
                ) : (
                  <BsEyeSlash
                    className="absolute right-3 top-2.5 md:top-3 cursor-pointer transition-opacity duration-200 hover:opacity-70 text-gray-600"
                    onClick={() => setShowRepeat((v) => !v)}
                  />
                )}
              </div>
            </div>

            <div hidden={isLogin}>
              <span className="text-sm md:text-base">Email</span>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-sm md:text-base transition-all duration-200"
                required={!isLogin}
              />
            </div>

            <button
              className="mt-5 py-2.5 md:py-3 text-sm md:text-base rounded-lg border border-transparent px-3 md:px-5 font-medium bg-[#1a1a1a] text-white cursor-pointer transition-all duration-200 hover:border-[#646cff] hover:scale-101 hover:shadow-xl focus:outline focus:outline-white disabled:hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitDisabled}
            >
              {isLoading ? (
                <span className="flex gap-1 justify-center items-center">
                  Loading
                  <ClipLoader color={"white"} size={15} />
                </span>
              ) : isLogin ? (
                "Login"
              ) : (
                "Register"
              )}
            </button>
          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Auth;
