import React from 'react';
import './InfoBox.css';

const registerText = `19/09/2023: Animal capturado, avaliado e registrado (Indira). Coleira AnimalLife implantada.
14/09/2023: Animal encontrado em condições saudáveis, entre a área 22 e 23, sem foto registrada:`;


const InfoBox = () => {
  return (
    <>
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
    <div className="checkboxes-container">
        <label><input type="checkbox" readOnly /> Herbívoro</label>
        <label><input type="checkbox" checked readOnly /> Carnívoro</label>
        <label><input type="checkbox" readOnly /> Onívoro</label>
        <label><input type="checkbox" readOnly /> Macho</label> 
        <label><input type="checkbox" checked readOnly /> Fêmea</label>
    </div>

    <div className="register-box">
      <h3>Registro:</h3>
      <textarea readOnly value={registerText}></textarea>
    </div> 
    </>
  );
};

export default InfoBox;