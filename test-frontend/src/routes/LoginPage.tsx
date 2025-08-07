import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { LoginFormData } from "../types";
import { useAuth } from "../context/useAuth";

const LoginPage: React.FC = () => {
  //const navigate = useNavigate();
  const { login } = useAuth();
  //const [email, setEmail] = useState('');
  //const [password, setPassword] = useState('');
  // const [isLogin, setIsLogin] = useState<boolean>(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      console.log("Can not submit. (Login failed)", error);
    }
  };
  /*const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin) {
      setIsLogin(true);
      try {
        const res = await axios.post<LoginResponse>(
          "/api/auth/login",
          {
            email: formData.email,
            password: formData.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        localStorage.setItem("token", res.data.token); // store the token
        navigate("/");
      } catch (error) {
        console.error("Can not login", error);
      }
    }
  };*/

  return (
    <div>
      
      <div className="bg-[#E4DBF7] font-[Montserrat] min-h-screen flex items-center justify-center">
        <div className="bg-white w-70 p-5 rounded-xl shadow-md space-y-4 text-center">
          <h2 className="text-lg font-bold text-gray-900">Welcome Back!</h2>

          <form onSubmit={onSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                autoComplete="email"
                onChange={handleChange}
                required
                className="w-full text-xs mt-1 px-3 py-2 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DDD6FB]"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 flex justify-between items-center">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full mt-1 px-3 py-2 text-xs text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DDD6FB]"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="text-sm w-full bg-[#756AB6] hover:bg-[#6459A2] cursor-pointer text-white font-semibold py-2 rounded-md transition duration-200"
            >
              Login
            </button>
          </form>

          <p className="text-xs text-gray-600">
            Don’t Have An Account ?
            <Link
              to="/register"
              className="text-[#756AB6] ml-1 font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
