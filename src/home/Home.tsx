import { useState } from "react";
import "./Home.css";
import { BsEye } from "react-icons/bs";
import { ClipLoader } from "react-spinners";
import useAuth from "../hooks/useAuth";

function Home() {
  const [hide, setHide] = useState(true);
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
    <div className="flex flex-col justify-center items-center min-h-screen">
      {error && <div className="bg-red-500 text-white p-2">{error}</div>}
      <div className="flex flex-col bg-white shadow-sm p-5 gap-5 h-full">
        <h2 className="text-lg font-semibold text-center">
          {isLogin ? "Login to your account" : "Create a new account"}
        </h2>

        <div className="flex justify-between">
          <button
            className={`cursor-pointer w-full px-10 py-2 ${
              isLogin && "bg-gray-100 border-b-2"
            }`}
            disabled={isLogin}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`cursor-pointer w-full px-10 py-2 ${
              !isLogin && "bg-gray-100 border-b-2"
            }`}
            disabled={!isLogin}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <form
          onSubmit={isLogin ? login : register}
          className="flex flex-col gap-4"
        >
          <div>
            <span>Username</span>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border rounded-lg px-2 py-1"
              required
              autoFocus
            />
          </div>

          <div>
            <span>Password</span>
            <div className="relative">
              <input
                type={hide ? "password" : "text"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-lg px-2 py-1 pr-8"
                required
              />
              <BsEye
                className="absolute right-2 top-2 cursor-pointer"
                onClick={() => setHide((v) => !v)}
              />
            </div>
          </div>

          <div hidden={isLogin}>
            <span>Repeat Password</span>
            <div className="relative">
              <input
                type={hide ? "password" : "text"}
                name="repeatPassword"
                value={formData.repeatPassword}
                onChange={handleChange}
                className={`w-full border rounded-lg px-2 py-1 pr-8 ${
                  formData.repeatPassword && !passwordsMatch
                    ? "border-red-500"
                    : formData.repeatPassword && passwordsMatch
                    ? "border-green-500"
                    : ""
                }`}
                required={!isLogin}
              />
              <BsEye
                className="absolute right-2 top-2 cursor-pointer"
                onClick={() => setHide((v) => !v)}
              />
            </div>

            {formData.repeatPassword && !passwordsMatch && (
              <span className="text-red-500 text-sm">
                Passwords do not match
              </span>
            )}
            {formData.repeatPassword && passwordsMatch && (
              <span className="text-green-500 text-sm">Passwords match</span>
            )}
          </div>

          <div hidden={isLogin}>
            <span>Email</span>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-2 py-1"
              required={!isLogin}
            />
          </div>

          <button className="buttonAuth mt-5" disabled={isSubmitDisabled}>
            {isLoading ? (
              <span className="flex gap-1 justify-center items-center">
                Loading
                <ClipLoader color={"white"} loading size={15} />
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;
