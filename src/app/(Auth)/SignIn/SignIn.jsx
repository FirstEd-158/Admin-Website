"use client";
import React, { useState } from "react";
import loginsvg from "../../Assets/login.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SigninFunction } from "@/Helper/Services/LoginService";
import { toast } from "react-toastify";

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault(); // prevent page reload
    console.log("Email:", email);
    console.log("Password:", password);


    const data = {
      username: email,
    password: password,
    }

    
    
      try {
        console.log("1");
        
       const result = await SigninFunction(data);
       console.log("2");
       console.log(result);
       localStorage.setItem('accessToken', result.data.access_token);
       toast.success("User Logged Successfully",
                {position: 'top-center'}
              );
        
        router.push("/Admin");
        // router.push("/Users");
      } catch (error) {
        console.log(error);
        
      }

    // console.log(data);
    //  here you can call your login API
  };

  return (
    <div className="min-h-[calc(100vh-59px)] flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] px-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20">

        {/* Left side: Image */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-black/20">
          <div className="my-5 flex p-2 justify-center">
            <Image src={loginsvg} alt="login banner image" />
          </div>
        </div>

        {/* Right side: Login Form */}
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="w-full max-w-md space-y-6">
            {/* Heading */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                Welcome Back
              </h2>
              <p className="text-white/80 mt-1 text-sm">
                Sign in to continue your GATE CSE journey
              </p>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <a
                  href="#"
                  className="text-sm text-teal-300 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-400 to-blue-500 text-black py-2 rounded-lg font-semibold shadow-lg hover:opacity-90 transition-all"
              >
                Login
              </button>

              {/* Google Login */}
              <button
                type="button"
                className="w-full border border-white/30 bg-white/10 py-2 rounded-lg flex items-center justify-center gap-2 text-white hover:bg-white/20 transition-all"
              >
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Continue with Google
              </button>
            </form>

            {/* Signup Link */}
            <p className="text-sm text-white/80 text-center mt-6">
              Don&apos;t have an account?{" "}
              <span
                onClick={() => router.push("/SignUp")}
                className="text-teal-300 hover:underline cursor-pointer"
              >
                Sign up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
