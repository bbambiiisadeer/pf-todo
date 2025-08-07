import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useState } from "react";
import type { RegisterFormData } from "../types";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    username: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", username: "", password: "" };
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      valid = false;
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await register(formData.email, formData.password, formData.username);
    } catch (error) {
      toast.error("Registration failed");
      console.log("Can not submit. (Signin failed)", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#E4DBF7] font-[Montserrat] min-h-screen flex items-center justify-center">
      <div className="bg-white w-80 p-5 rounded-xl shadow-md space-y-3 text-center">
        <h2 className="text-lg font-bold text-gray-900">Create Account</h2>

        <form onSubmit={onSubmit} className="space-y-4 text-left">
      

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={`w-full mt-1 px-3 py-2 text-xs text-gray-800 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-[#DDD6FB]`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose your username"
              className={`text-xs w-full mt-1 px-3 py-2 text-gray-800 border ${
                errors.username ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-[#DDD6FB]`}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              placeholder="Create a strong password"
              className={`w-full mt-1 px-3 py-2 text-xs text-gray-800 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-[#DDD6FB]`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#756AB6] hover:bg-[#6459A2] text-white font-semibold py-2 rounded-md text-sm transition duration-200 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-xs text-gray-600">
          Already have an account?
          <Link
            to="/login"
            className="text-[#756AB6] ml-1 font-medium hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
