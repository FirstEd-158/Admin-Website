"use client";
import React, { useState } from "react";
import loginsvg from "../../Assets/login.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SignupFunction } from "@/Helper/Services/AuthService";
import { toast } from "react-toastify";
import { signupSchema } from "../SignIn/Validation"; // your schema file

const Signup = () => {
  const router = useRouter();

  //  States for inputs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build user object to validate
    const user = {
      fullName,
      email,
      password,
      confirmPassword,
      terms,
    };

    // Zod validation
    const result = signupSchema.safeParse(user);

    if (!result.success) {
      console.log("Validation issues:", result.error.issues); // debug
      result.error.issues.forEach((err) => {
        toast.error(err.message, { position: "top-center" });
      });
      return;
    }



    //  Basic validations //replaced by zod validation 
    //  if (!terms) 
    // {  alert("You must agree to the Terms & Conditions.");
    //  return; 
    // } 
    //  if (password !== confirmPassword) { 
    // alert("Passwords do not match."); 
    //  return; 
    // }

    //  Only runs if validation passes
    const data = {
      username: email,
      password: password,
      full_name: fullName,
      contact: "1234567890",
      address: "xyz",
    };

    console.log("Payload to send:", data);

    try {
      console.log(1);
      
      const result = await SignupFunction(data);
      console.log(result);

      toast.success("User Signed Successfully", {
        position: "top-center",
      });

      router.push("/Admin");
    } catch (error) {
      console.error(error);
      toast.error("Signup failed");
    }
    //  here you can call signup API
  };


  return (
    <div className="min-h-[calc(100vh-59px)] p-5 flex items-center justify-center bg-gradient-to-br from-[#2c5364] via-[#203a43] to-[#0f2027] px-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20">
        {/* Left side: Signup Form */}
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="w-full max-w-md space-y-6">
            {/* Heading */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                Create Account
              </h2>
              <p className="text-white/80 mt-1 text-sm">
                Start your GATE CSE preparation journey today
              </p>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

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

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center text-white/80">
                <input
                  type="checkbox"
                  id="terms"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <a href="#" className="text-teal-300 hover:underline">
                    Terms & Conditions
                  </a>
                </label>
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-400 to-blue-500 text-black py-2 rounded-lg font-semibold shadow-lg hover:opacity-90 transition-all"
              >
                Create Account
              </button>

              {/* Google Signup */}
              <button
                type="button"
                className="w-full border border-white/30 bg-white/10 py-2 rounded-lg flex items-center justify-center gap-2 text-white hover:bg-white/20 transition-all"
              >
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Sign up with Google
              </button>
            </form>

            {/* Login Link */}
            <p className="text-sm text-white/80 text-center mt-6">
              Already have an account?{" "}
              <span
                onClick={() => router.push("/SignIn")}
                className="text-teal-300 hover:underline cursor-pointer"
              >
                Login
              </span>
            </p>
          </div>
        </div>

        {/* Right side: Image */}
        <div className="hidden p-3 md:flex flex-1 relative bg-black/20">
          <Image
            src={loginsvg}
            alt="login banner image"
            fill
            className="object-cover p-3"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
