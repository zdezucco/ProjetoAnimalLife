import React from 'react';
import Logo from "../assets/Logo.svg";
import '../styles/recuperasenha.css';
import { useNavigate } from 'react-router';

const RecuperaSenha: React.FC = () => {
  const navigate = useNavigate();

  const enviaLink = () => {
    navigate('/novasenha');
  }

  return (
    <div className="reset-container">
      <div className="reset-logo">
        <img src={Logo} alt="AnimalLife Logo" />
      </div>

      <div className="reset-form">
        <div className="reset-password">Insira seu e-mail que enviaremos
            um link de redefinição de senha
        </div>
        <input type="text" placeholder="Digite seu E-mail" className="reset-input" />
        <button className="send-button" onClick={enviaLink}>Enviar Link de Redefinição</button>
      </div>
    </div>
  );
};

export default RecuperaSenha;
