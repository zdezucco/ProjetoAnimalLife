import React from 'react';
import Logo from "../assets/Logo.svg";
import '../styles/loadingScreen.css';

const LoadingScreen: React.FC = () => {
  return (
    <div className="splash-container">
      <div className="logo">
        <img src={Logo} alt="AnimalLife" className="logo-img" />
      </div>

      <div className="loading">
        <div className="spinner"></div>
        <p>Aguarde</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
