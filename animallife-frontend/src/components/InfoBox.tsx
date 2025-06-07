import '../styles/infobox.css';

const registerText = `19/09/2023: Animal capturado, avaliado e registrado (Indira). Coleira AnimalLife implantada.
14/09/2023: Animal encontrado em condições saudáveis, entre a área 22 e 23, sem foto registrada:`;


const InfoBox = () => {
  return (
    <>
    <div className="info-box-container">
      <h4>Informações</h4>
      <form className="info-form">
        <div className="form-group">
          <label htmlFor="name">Nome:</label>
          <input id="name" type="text" value="Indira" readOnly />
        </div>

        <div className="form-group">
          <label htmlFor="species">Espécie:</label>
          <input id="species" type="text" value="Panthera Onca" readOnly />
        </div>

        <div className="form-group">
          <label htmlFor="breed">Raça:</label>
          <input id="breed" type="text" value="Onça Pintada" readOnly />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="weight">Peso:</label>
            <input id="weight" type="text" value="86 Kg" readOnly />
          </div>
          <div className="form-group">
            <label htmlFor="length">Comprimento:</label>
            <input id="length" type="text" value="1,70 Metros" readOnly />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="age">Idade:</label>
            <input id="age" type="text" placeholder="Digite" />
          </div>
          <div className="form-group">
            <label htmlFor="height">Altura:</label>
            <input id="height" type="text" placeholder="Digite" />
          </div>
        </div>
      </form>
    </div>

    <div className="checkboxes-section">
      <div className="checkbox-group">
        <label className="group-label">Dieta:</label>
        <div className="options">
          <label><input type="checkbox" /> Herbívoro</label>
          <label><input type="checkbox" checked /> Carnívoro</label>
          <label><input type="checkbox" /> Onívoro</label>
        </div>
      </div>
      <div className="checkbox-group">
        <label className="group-label">Sexo:</label>
        <div className="options">
          <label><input type="checkbox" /> Macho</label>
          <label><input type="checkbox" checked /> Fêmea</label>
        </div>
      </div>
    </div>

    <div className="register-box">
      <h3>Registro:</h3>
      <textarea readOnly value={registerText}></textarea>
    </div>
    </>
  );
};

export default InfoBox;