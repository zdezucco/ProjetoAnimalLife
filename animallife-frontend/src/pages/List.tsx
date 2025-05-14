import { Bell, Search, Filter } from "lucide-react";
import "../styles/index.css";
import "../styles/list.css";
import StarIcon from "../assets/fav-icon.svg";
import GreenTemp from "../assets/green-term.svg";
import RedTemp from "../assets/red-term.svg";
import OrangeTemp from "../assets/orange-term.svg";
import GrayTemp from "../assets/gray-term.svg";
import { useNavigate } from "react-router";


const animals = [
  { name: "INDIRA", temp: 39.5, gender: "♀", status: "normal", starred: true },
  { name: "LIRA", temp: 39.7, gender: "♀", status: "normal" },
  { name: "JUSSARA", temp: 35.9, gender: "♀", status: "low" },
  { name: "LITA", temp: 40.2, gender: "♀", status: "high" },
  { name: "TINO", temp: 39.1, gender: "♂", status: "normal" },
  { name: "LECO", temp: 41.1, gender: "♂", status: "high" },
  { name: "53020", temp: 0.0, gender: "?", status: "unknown" },
];

const getStatusIcon = (status = "") => {
  switch (status) {
    case "normal": return GreenTemp;
    case "low": return RedTemp;
    case "high": return OrangeTemp;
    default: return GrayTemp;
  }
};

const getStatusColor = (status = "") => {
  switch (status) {
    case "normal": return "#4CAF50";
    case "low": return "#E53935";
    case "high": return "#FF9800";
    default: return "#757575";
  }
};

export default function AnimalList() {
  const navigate = useNavigate();

  const acessarMonitoramento = () => {
    navigate("/Monitoramento");
  }

  return (
    <div className="TelaAnimal">
      <div id="background-list">
      <div className="notification">
            <Bell className="bell-icon" />
            <span className="notification-count">2</span>
      </div>
      <div id="top-header">
        <h1 className="header">Animais</h1>
      </div>

        <div id="search-container">
          <div id="searchbar">
            <div className="search-bar">
              <Search className="icon search-icon" size={16} />
              <input type="text" placeholder="Pesquisar" className="search-input" />
              <Filter className="icon filter-icon" size={16} />
            </div>
          </div>
        </div>

        <div className="animal-list">
          {animals.map((animal, index) => {
            const TempIcon = getStatusIcon(animal.status);
            return (
              <div key={index} className="animal-item" onClick={acessarMonitoramento}>
                <div className="animal-card">
                  <div className="animal-avatar" />
                  <div className="animal-info">
                    <div className="animal-name">
                      {animal.name}
                      {animal.starred && (
                        <img 
                          src={StarIcon} 
                          alt="Estrela" 
                          className="star-icon" 
                          style={{ width: '16px', height: '16px', marginLeft: '4px' }}
                        />
                      )}
                    </div>
                    <div className="animal-type">Onça Pintada</div>
                  </div>
                  <div className="temp-container">
                    <img src={TempIcon} alt="Temperature" className="temp-icon" />
                    <span className="animal-temp" style={{ color: getStatusColor(animal.status) }}>
                      {animal.temp.toFixed(1)}°c
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
