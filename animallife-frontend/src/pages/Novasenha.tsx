import React from 'react';
import Logo from "../assets/Logo.svg";
import '../styles/novasenha.css';
import { useNavigate } from 'react-router';



const NovaSenha: React.FC = () => {
  const navigate = useNavigate();

  const acessarLogin = () => {
    navigate('/');
  };

  return (
    <div className="password-container">
      <div className="password-logo">
        <img src={Logo} alt="AnimalLife Logo" />
      </div>

      <div className="password-form">
        <div className="confirm-password">Insira a sua nova senha</div>
        <input type="text" placeholder="Nova senha" className="password-input" />
        <input type="text" placeholder="Repita a nova senha" className="newpassword-input" />
        <button className="confirm-button" onClick={acessarLogin}>Confirmar</button>
      </div>
    </div>
  );
};

export default NovaSenha;
