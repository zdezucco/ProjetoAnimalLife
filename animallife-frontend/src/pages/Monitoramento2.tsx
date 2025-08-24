import {Bell} from "lucide-react";
import React from 'react';
import Animal from '../assets/animal.svg';
import Refresh from '../assets/refresh.svg';
import Female from '../assets/female-icon.svg';
import FavIcon from '../assets/fav-icon.svg';
import Temp from '../assets/term.svg';
import Editicon from '../assets/edit-icon.svg';
import Return from '../assets/return.svg';
import '../styles/monitoramento.css';
import { useNavigate } from "react-router";

const Monitoramento2: React.FC = () => {
  const navigate = useNavigate();

  const Retornar = () => {
    navigate("/List");
  }

  return (    
    <div className="profile-container">
      
      <div className="header-icons">
        <img src={Return} alt="Botao de voltar" className="icon-return" onClick={Retornar}/>
        <div className="header-right">
            <div className="notification">
                <Bell className="bell-icon" />
                <span className="notification-count">2</span>
            </div>
          <img src={FavIcon} alt="Icone de Favorito" className="icon-star"/>
        </div>
      </div>

      <div className="animal-photo-section">
        <img src={Animal} alt="Animal" className="animal-photo" />
        <p className="animal-id">Coleira 53014</p>
        <img src={Editicon} alt="" className="edit-icon"/>
      </div>

      <div className="animal-name-box">
        
        <img src={Refresh} alt="Icone de Atualizar" className='icon'/>
        <div className="animal-name-info">
          <h2>INDIRA</h2>
          <p>Onça Pintada</p>
        </div>
        <div className="animal-sex">
          <img src={Female} alt="Logo Gênero" className="sex-badge"/>
          <p className="sex-text">Fêmea</p>
        </div>
      </div>

      <div className="temperature-box">
        <p><strong>Temperatura:</strong></p>
        <div className="temperature-status">
          <div className="icon-container">
            <img src={Temp} alt="Icone Temperatura" className="temp-icon"/>
            <p className="temp-value">39.5°C</p>
          </div>
          <p className="average">Média: 38.2°C</p>
        </div>
        <p className="status">Saudável</p>
      </div>

      <div className="info-box">
        <h3>Informações</h3>
        <form className="info-form">
          <input type="text" value="Indira" readOnly />
          <input type="text" value="Panthera Onca" readOnly />
          <input type="text" value="Onça Pintada" readOnly />
          <div className="row">
            <input type="text" value="86 Kg" readOnly />
            <input type="text" value="1,70 Metros" readOnly />
          </div>
          <div className="row">
            <input type="text" placeholder="Idade" />
            <input type="text" placeholder="Altura" />
          </div>
          <div className="row">
            <input type="text" placeholder="Dieta" />
            <input type="text" placeholder="Área" />
          </div>
        </form>
      </div>

      <div className="checkboxes">
        <label><input type="checkbox" readOnly /> Herbívoro</label>
        <label><input type="checkbox" checked readOnly /> Carnívoro</label>
        <label><input type="checkbox" readOnly /> Onívoro</label>
        <label><input type="checkbox" readOnly /> Macho</label>
        <label><input type="checkbox" checked readOnly /> Fêmea</label>
      </div>

      <div className="register-box">
        <h3>Registro:</h3>
        <textarea readOnly value={`19/09/2023: Animal capturado, avaliado e registrado (Indira). Coleira AnimalLife implantada.
14/09/2023: Animal encontrado em condições saudáveis, entre a área 22 e 23, sem foto registrada:`}></textarea>
      </div>
    </div>
  );
};

export default Monitoramento2;
