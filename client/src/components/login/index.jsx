import React, { useEffect, useState } from "react";
import { usePostLoginMutation, usePostSignUpMutation } from "@/state/api";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

// Custom Toast Component (Persistent, Multiline)
const Toast = ({ message, type, onClose }) => {
  return (
    <div className={`toast-container`}>
      <div className={`toast ${type}`}>
        <div className="toast-content">
          {message.split("\n").map((line, index) =>
            line === "" ? <br key={index} /> : <p key={index}>{line}</p>
          )}
        </div>
        <button className="close-btn" onClick={onClose}>✖</button>
      </div>
    </div>
  );
};



const Login = ({ setUser, setSecret }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [triggerLogin] = usePostLoginMutation();
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
    if (!validateInput()) return;

    setLoading(true);
    const result = await triggerLogin({ username, password });
    setLoading(false);

    if (result.error) {
      showToast("❌ Login failed.\nPlease check your credentials and try again.", "error");
    } else {
      setUser(username);
      setSecret(password);
      showToast("✅ Login successful!\nWelcome back!", "success");
    }
  };

  const handleRegister = async () => {
    if (!validateInput()) return;

    setLoading(true);
    const result = await triggerSignUp({ username, password });
    setLoading(false);

    if (result.error) {
      showToast("❌ Registration failed.\nPlease try again later.", "error");
    } else {
      showToast("✅ Registration successful!\nYou can now log in.", "success");
      ClearInput();
    }
  };

  const handleInputChange = (setter, fieldName) => (e) => {
    setter(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: null }));
  };

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  useEffect(() => {
    setTimeout(() => {
      showToast("⚠ Update:\nIts sad to say chatengine.io has been shut-down,\nthats been said it was our skeleton of this project,\nso this project doesn't work anymore.\n\n ITS HERE JUST TO KEEP THE RESPECT OF\n MY TIME & EFFORTS", "multiline");
    }, 5000);
  }, []);

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
          
          <div className="password-input-container">
            <input
              className="login-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handleInputChange(setPassword, "password")}
            />
            <span className="icon-container" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeSlashIcon className="eye-icon" />
              ) : (
                <EyeIcon className="eye-icon" />
              )}
            </span>
          </div>
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

      {toast && (
        <Toast
          position="top-center"
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Login;
