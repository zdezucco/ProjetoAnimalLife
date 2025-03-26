import { Bell, Search, Filter } from "lucide-react";
import "./styles/index.css";
import "./styles/list.css";

const animals = [
  { name: "INDIRA", temp: 39.5, gender: "♀", status: "normal" },
  { name: "LIRA", temp: 39.7, gender: "♀", status: "normal" },
  { name: "JUSSARA", temp: 35.9, gender: "♀", status: "low" },
  { name: "LITA", temp: 40.2, gender: "♀", status: "high" },
  { name: "TINO", temp: 39.1, gender: "♂", status: "normal" },
  { name: "LECO", temp: 41.1, gender: "♂", status: "high" },
  { name: "53020", temp: 0.0, gender: "?", status: "unknown" },
];

const getStatusColor = (status = "") => {
  switch (status) {
    case "normal": return "#4CAF50";
    case "low": return "#E53935";
    case "high": return "#FF9800";
    default: return "#757575";
  }
};

export default function AnimalList() {
  return (
    <>
      <div className="container" id="TelaAnimal">
        <div className="header">Animais</div>

        <div className="notification">
          <Bell className="bell-icon" />
          <span className="notification-count">2</span>
        </div>

        <div className="container" id="listagem">

          <div className="search-bar" id="barrapesquisa">
            <Search className="icon search-icon" />
            <input type="text" placeholder="Pesquisar" className="search-input" />
            <Filter className="icon filter-icon" />
          </div>

          <div className="animal-list">
            {animals.map((animal, index) => (
              <div key={index} className="animal-card">
                <div className="animal-avatar" />
                <div className="animal-info">
                  <div className="animal-name">{animal.name}</div>
                  <div className="animal-type">Onça Pintada</div>
                </div>
                <div className="animal-temp" style={{ color: getStatusColor(animal.status) }}>
                  {animal.temp.toFixed(1)}°c
                </div>
              </div>
            ))}
          </div> 

        </div>
      </div>
      <footer>
        <div id="footer_content">
        </div>
      </footer>
    </>        
  );
}
