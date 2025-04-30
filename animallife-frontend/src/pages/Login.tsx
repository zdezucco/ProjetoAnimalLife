import React from 'react';
import Logo from "../assets/Logo.svg";
import '../styles/login.css';

const Login: React.FC = () => {
  return (
    <div className="login-container">
      <div className="login-logo">
        <img src={Logo} alt="AnimalLife Logo" />
      </div>

      <div className="login-form">
        <input type="text" placeholder="Login" className="login-input" />
        <input type="password" placeholder="Senha" className="password-input" />
        <div className="forgot-password">Esqueceu sua senha?</div>
        <button className="login-button">Entrar</button>
      </div>
    </div>
  );
};

export default Login;
