import React from 'react';
import '../styles/monitoramento.css';

const Monitoramento2: React.FC = () => {
  return (
    <div className="profile-container">
      <div className="header-icons">
        <button className="icon-button">←</button>
        <div className="header-right">
          <span className="notification-dot"></span>
          <button className="icon-button">🔔</button>
          <button className="icon-button star">⭐</button>
        </div>
      </div>

      <div className="animal-photo-section">
        <img src="/assets/animal.jpg" alt="Animal" className="animal-photo" />
        <p className="animal-id">Coleira 53014</p>
        <span className="edit-icon">✎</span>
      </div>

      <div className="animal-name-box">
        <div className="icon">📷</div>
        <div className="animal-name-info">
          <h2>INDIRA</h2>
          <p>Onça Pintada</p>
        </div>
        <div className="sex-badge">Fêmea ♀️</div>
      </div>

      <div className="temperature-box">
        <p><strong>Temperatura:</strong></p>
        <div className="temperature-status">
          <p className="temp-value">🌡️ 39.5°C</p>
          <p className="status">Saudável</p>
        </div>
        <p className="average">Média: 38.2°C</p>
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
        <label><input type="checkbox" checked readOnly /> Herbívoro</label>
        <label><input type="checkbox" checked readOnly /> Carnívoro</label>
        <label><input type="checkbox" readOnly /> Onívoro</label>
        <label><input type="checkbox" readOnly /> Macho ♂️</label>
        <label><input type="checkbox" checked readOnly /> Fêmea ♀️</label>
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
