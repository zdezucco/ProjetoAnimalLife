import React from 'react';
import Logo from "../assets/Logo.svg";
import '../styles/login.css';
import { useNavigate } from 'react-router';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const acessarList = () => {
    navigate('/list');
  };

  const esqueciSenha = () => {
    navigate('/recuperasenha');
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <img src={Logo} alt="AnimalLife Logo" />
      </div>

      <div className="login-form">
        <input type="text" placeholder="Login" className="login-input" />
        <input type="password" placeholder="Senha" className="password-input" />
        <div className="forgot-password" onClick={esqueciSenha} style={{ cursor: 'pointer', color: 'white', textDecoration: 'underline' }}>Esqueceu sua senha?</div>
        <button className="login-button" onClick={acessarList}>Entrar</button>
      </div>
    </div>
  );
};

export default Login;
