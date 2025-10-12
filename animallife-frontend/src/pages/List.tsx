import { Bell, Search, Filter } from "lucide-react";
import "../styles/index.css";
import "../styles/list.css";
import StarIcon from "../assets/fav-icon.svg";
import GreenTemp from "../assets/green-term.svg";
import RedTemp from "../assets/red-term.svg";
import OrangeTemp from "../assets/orange-term.svg";
import GrayTemp from "../assets/gray-term.svg";
import FemaleIcon from "../assets/female-icon.png";
import MaleIcon from "../assets/male-icon.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import FooterBar from "../components/FooterBar";
import NotificationPopup, { NotificationItem } from "../components/NotificationPopup";
import { supabase } from "../supabaseClient";

interface Animal {
  id: number;
  nome: string;
  especie: string;
  sexo: string;
  registro: string;
  starred?: boolean;
  avatar?: string;
  monitoramento?: {
    valor_temperatura: number;
  };
}

const notifications: NotificationItem[] = [
  { id: 1, level: "URGENTE", message: "Alerta Extremo de saúde! Clique para verificar os dados!", image: "/avatars/jussara.png", collar: "003" },
  { id: 2, level: "ATENÇÃO", message: "Alerta de saúde! Clique para verificar os dados!", image: "/avatars/lira.png", collar: "004" },
  { id: 3, level: "URGENTE", message: "Alerta Extremo de saúde! Clique para verificar os dados!", image: "/avatars/leco.png", collar: "006" },
];

const getStatusIcon = (temp: number | undefined) => {
  if (temp === undefined ) return GrayTemp;
  if (temp === 0) return GrayTemp;
  if (temp === null) return GrayTemp;
  if (temp <= 35) return RedTemp;
  if (temp <= 36 && temp >= 35.1) return OrangeTemp;
  if (temp >= 40 && temp <= 41) return OrangeTemp;
  if (temp >= 41.1) return RedTemp;
  return GreenTemp;
};

const getStatusColor = (temp: number | undefined) => {
  if (temp === undefined ) return 'var(--gray-temp)';
  if (temp === 0) return 'var(--gray-temp)';
  if (temp === null) return 'var(--gray-temp)';
  if (temp <= 35) return 'var(--red-temp)';
  if (temp <= 36 && temp >= 35.1) return 'var(--orange-temp)';
  if (temp >= 40 && temp <= 41) return 'var(--orange-temp)';
  if (temp >= 41) return 'var(--red-temp)';
  return 'var(--green-temp)';
};

const getSpeciesName = (especie: string) => {
  if (!especie) return "Desconhecido";

  switch (especie.toUpperCase()) {
    case "ONCA_PINTADA":
      return "Onça Pintada";
    case "LOBO_GUARA":
      return "Lobo-Guará";
    case "ANTA":
      return "Anta";
    default:
      // Transforma algo como "MACACO_PREGO" → "Macaco Prego"
      return especie
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
  }
};

export default function AnimalList() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAnimals = async () => {
      // Busca todos os animais
      const { data: animalData, error: animalError } = await supabase
        .from("animal")
        .select("*");

      if (animalError) {
        console.error("Erro ao buscar animais:", animalError);
        return;
      }

      // Busca os monitoramentos mais recentes
      const { data: monitoramentoData, error: monitoramentoError } = await supabase
        .from("monitoramento")
        .select("id_animal, valor_temperatura, data_monitoramento")
        .order("data_monitoramento", { ascending: false });

      if (monitoramentoError) {
        console.error("Erro ao buscar monitoramentos:", monitoramentoError);
        return;
      }

      // Combina animal + último monitoramento
      const mergedData = animalData.map((animal) => {
        const monitoramento = monitoramentoData.find(
          (m) => m.id_animal === animal.id
        );
        return { ...animal, monitoramento };
      });

      setAnimals(mergedData);
          // 🔔 Gera notificações automáticas
      const generatedNotifications: NotificationItem[] = mergedData
        .filter((a) => {
          const t = a.monitoramento?.valor_temperatura;
          return (
            t !== undefined &&
            t !== null &&
            ((t <= 35) || (t > 35 && t < 36) || (t >= 40))
          );
        })
        .map((a, index) => {
          const temp = a.monitoramento?.valor_temperatura || 0;
          const level =
            temp <= 35 || temp > 41 ? "URGENTE" : "ATENÇÃO";

          return {
            id: index + 1,
            level,
            message:
              level === "URGENTE"
                ? `${a.nome} está com alerta extremo de saúde!`
                : `${a.nome} apresenta variação de temperatura.`,
            image: a.avatar || "/avatars/default.png",
            collar: a.id.toString().padStart(3, "0"),
          };
        });

      setNotifications(generatedNotifications);
    };

    fetchAnimals();
  }, []);

  const acessarMonitoramento = (animalId: number) => {
    navigate(`/Monitoramento?id=${animalId}`);
  };

  const filteredAnimals = animals.filter((a) =>
    a.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="TelaAnimal">
      <div id="background-list">
        <div id="top-header">
          <h1 className="header">Animais</h1>
          
          <div
            className="notification"
            onClick={() => setShowNotifications(true)}
          >
            <Bell className="bell-icon" />
            {/* 🔔 Contador dinâmico */}
            {notifications.length > 0 && (
              <span className="notification-count">{notifications.length}</span>
            )}
          </div>
        </div>

        <div id="search-container">
          <div id="searchbar">
            <div className="search-bar">
              <Search className="icon search-icon" size={16} />
              <input
                type="text"
                placeholder="Pesquisar"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Filter className="icon filter-icon" size={16} />
            </div>
          </div>
        </div>

        <div className="animal-list">
          {filteredAnimals.map((animal) => {
            const temp = animal.monitoramento?.valor_temperatura;
            const TempIcon = getStatusIcon(temp);
            const speciesName = getSpeciesName(animal.especie);

            return (
              <div
                key={animal.id}
                className="animal-item"
                onClick={() => acessarMonitoramento(animal.id)}
              >
                <div className="animal-card">
                  <div className="animal-avatar">
                    <img
                      src={animal.avatar || "/avatars/default.png"}
                      alt={animal.nome}
                    />
                  </div>
                  <div className="animal-info">
                    <div className="animal-name">
                      {animal.nome}
                      {animal.starred && (
                        <img src={StarIcon} alt="Estrela" className="star-icon" />
                      )}
                    </div>
                    <div className="animal-type">
                      {speciesName}
                      <span className="gender">
                        {animal.sexo === "FEMEA" ? (
                          <img src={FemaleIcon} alt="Fêmea" className="gender-icon" />
                        ) : animal.sexo === "MACHO" ? (
                          <img src={MaleIcon} alt="Macho" className="gender-icon" />
                        ) : null}
                      </span>
                    </div>
                  </div>
                  <div className="temp-container">
                    <img src={TempIcon} alt="Temperature" className="temp-icon" />
                    <span className="animal-temp" style={{ color: getStatusColor(temp) }}>
                      {temp ? `${temp.toFixed(1)}°c` : "--°c"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <FooterBar />

      {/* 🔔 Notificações dinâmicas */}
      <NotificationPopup
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
      />
    </div>
  );
}
