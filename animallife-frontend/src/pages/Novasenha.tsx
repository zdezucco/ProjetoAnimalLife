import React from 'react';
import Logo from "../assets/Logo.svg";
import '../styles/novasenha.css';

const NovaSenha: React.FC = () => {
  return (
    <div className="password-container">
      <div className="password-logo">
        <img src={Logo} alt="AnimalLife Logo" />
      </div>

      <div className="password-form">
        <div className="confirm-password">Insira a sua nova senha</div>
        <input type="text" placeholder="Nova Senha" className="password-input" />
        <input type="text" placeholder="Repita a Nova Senha" className="newpassword-input" />
        <button className="confirm-button">Confirmar</button>
      </div>
    </div>
  );
};

export default NovaSenha;
