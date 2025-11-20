import React from 'react';
import Logo from "../assets/Logo.svg";
import '../styles/acess.css';
import { useNavigate } from 'react-router';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const acessarList = () => {
    navigate('/list');
  };

  return (
    <div className="acess-container">
      <div className="acess-logo">
        <img src={Logo} alt="AnimalLife Logo" />
      </div>

      <div className="acess-form">
        <button className="acess-button" onClick={acessarList}>Acessar sistema</button>
      </div>
    </div>
  );
};

export default Login;
