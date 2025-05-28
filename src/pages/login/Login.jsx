"use client";

import { useState } from "react";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { useLogin } from "./service/useLogin";
import logoImage from "../../assets/logo.png";
import "./Login.scss";

const Login = () => {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: loginUser, isPending } = useLogin();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.login && formData.password) {
      loginUser(formData);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <img
              src={logoImage || "/placeholder.svg"}
              alt="Jobs HR Logo"
              className="logo-image"
            />
          </div>
          <h1>Super Admin Panel</h1>
          <p>Tizimga kirish uchun ma'lumotlaringizni kiriting</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="login">Login</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input
                type="text"
                id="login"
                name="login"
                value={formData.login}
                onChange={handleInputChange}
                placeholder="Login kiriting"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Parol</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Parol kiriting"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isPending || !formData.login || !formData.password}
          >
            {isPending ? "Kirish..." : "Kirish"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
