import React, { useEffect, useState } from "react";
import { usePostLoginMutation, usePostSignUpMutation } from "@/state/api";

// Custom Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Auto close after 3 seconds
    return () => clearTimeout(timer); // Clear timer on unmount
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      <p>{message}</p>
      <button onClick={onClose}>x</button>
    </div>
  );
};

const Login = ({ setUser, setSecret }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // State for managing toast
  const [triggerLogin, resultLogin] = usePostLoginMutation();
  const [triggerSignUp] = usePostSignUpMutation();

  const validateInput = () => {
    const newErrors = {};

    if (!username || username.length < 4) {
      newErrors.username = "Username must be at least 4 characters long";
    }

    if (!password || password.length < 4) {
      newErrors.password = "Password must be at least 4 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateInput()) return; // Stop if validation fails

    setLoading(true);
    const result = await triggerLogin({ username, password });
    setLoading(false);

    if (result.error) {
      showToast("Login failed. Please try again.", "error"); // Show error toast
    } else {
      setUser(username);
      setSecret(password);
      showToast("Login successful!", "success"); // Show success toast
    }
  };

  const handleRegister = async () => {
    if (!validateInput()) return; // Stop if validation fails

    setLoading(true);
    const result = await triggerSignUp({ username, password });
    setLoading(false);

    if (result.error) {
      showToast("Registration failed. Please try again.", "error"); // Show error toast
    } else {
      showToast("Registration successful!", "success"); // Show success toast
      ClearInput();
    }
  };

  const handleInputChange = (setter, fieldName) => (e) => {
    setter(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: null })); // Clear error for that field
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000); // Auto close toast after 3 seconds
  };

  function ClearInput() {
    setUsername("");
    setPassword("");
    setErrors({});
  }

  useEffect(() => {
    const spinner = document.getElementById("cover-spin");
    spinner.style.display = loading ? "block" : "none";
  }, [loading]);

  return (
    <div className="login-page">
      <div id="cover-spin"></div>
      <div className="login-container">
        <h2 className="title">Trinity</h2>
        <p
          className="register-change"
          onClick={() => {
            ClearInput();
            setIsRegister(!isRegister);
          }}
        >
          {isRegister ? "Already a user?" : "Are you a new user?"}
        </p>
        <div>
          <input
            className="login-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleInputChange(setUsername, "username")}
          />
          {errors.username && <p className="error">{errors.username}</p>}
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={handleInputChange(setPassword, "password")}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <div className="login-actions">
          {isRegister ? (
            <button className="button" type="button" onClick={handleRegister}>
              Register
            </button>
          ) : (
            <button className="button" type="button" onClick={handleLogin}>
              Login
            </button>
          )}
        </div>
      </div>

      {/* Render Toast if there is a message */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Login;
