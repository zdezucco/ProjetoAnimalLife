import { Bell, Search } from "lucide-react";
import "../styles/index.css";
import "../styles/list.css";
import StarIcon from "../assets/fav-icon.svg";

import grayTerm from "../assets/gray-term-monit.svg";
import greenTerm from "../assets/green-term-monit.svg";
import redTerm from "../assets/red-term-monit.svg";
import orangeTerm from "../assets/orange-term-monit.svg";

import grayHeart from "../assets/gray-heart.svg";
import greenHeart from "../assets/green-heart.svg";
import redHeart from "../assets/red-heart.svg";
import orangeHeart from "../assets/orange-heart.svg";

import grayBlood from "../assets/blood-gray.svg";
import greenBlood from "../assets/blood-green.svg";
import redBlood from "../assets/blood-red.svg";
import orangeBlood from "../assets/blood-orange.svg";

import FemaleIcon from "../assets/female-icon.png";
import MaleIcon from "../assets/male-icon.png";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import FooterBar from "../components/FooterBar";
import NotificationPopup, { NotificationItem } from "../components/NotificationPopup";
import { supabase } from "../supabaseClient";
import LoadingScreen from "../pages/Loadingscreen";

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
    valor_frequencia_cardiaca: number;
    valor_saturacao_oxigenio: number;
  };
}

// ======================
//  TEMPERATURA
// ======================
const getTempIcon = (t: number | undefined) => {
  if (!t) return grayTerm;
  if (t <= 36.0) return redTerm;
  if (t >= 36.1 && t <= 37.4) return orangeTerm;
  if (t >= 39.6 && t <= 40.0) return orangeTerm;
  if (t >= 40.1) return redTerm;
  return greenTerm;
};

// ======================
//  FREQUÊNCIA CARDÍACA
// ======================
const getHeartIcon = (fc: number | undefined) => {
  if (!fc) return grayHeart;
  if (fc <= 50) return redHeart;
  if (fc >= 51 && fc <= 59) return orangeHeart;
  if (fc >= 101 && fc <= 119) return orangeHeart;
  if (fc >= 120) return redHeart;
  return greenHeart;
};

// ======================
//  OXIGENAÇÃO
// ======================
const getOxygenIcon = (o2: number | undefined) => {
  if (!o2) return grayBlood;
  if (o2 <= 90) return redBlood;
  if (o2 >= 91 && o2 <= 94) return orangeBlood;
  return greenBlood;
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
  const [loading, setLoading] = useState(true);

  // ============================
  // FETCH COM TRATAMENTO COMPLETO
  // ============================
  const fetchAnimals = async () => {
    setLoading(true);
    const start = Date.now();

    const { data: animalDataRaw } = await supabase.from("animal").select("*");
    const { data: monitorDataRaw } = await supabase
      .from("monitoramento")
      .select(
        "id_animal, valor_temperatura, valor_saturacao_oxigenio, valor_frequencia_cardiaca, data_monitoramento"
      )
      .order("data_monitoramento", { ascending: false });

    const animalsRows = animalDataRaw ?? [];
    const monitorRows = monitorDataRaw ?? [];

    // 💡 TRATAMENTO FINAL DE ID + MERGE SEGURO
    const merged = animalsRows.map((a: any) => {
      const idA = Number(a.id);

      const monitoramento = monitorRows.find(
        (m: any) => Number(m.id_animal) === idA
      );

      return { ...a, monitoramento };
    });

    setAnimals(merged);

    // Delay mínimo de 1s
    const elapsed = Date.now() - start;
    const wait = 1000 - elapsed;
    setTimeout(() => setLoading(false), wait > 0 ? wait : 0);
  };

  // ============================
  // REALTIME
  // ============================
  useEffect(() => {
    fetchAnimals();

    const animalCh = supabase
      .channel("animal_rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "animal" }, fetchAnimals)
      .subscribe();

    const monCh = supabase
      .channel("monitor_rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "monitoramento" }, fetchAnimals)
      .subscribe();

    return () => {
      supabase.removeChannel(animalCh);
      supabase.removeChannel(monCh);
    };
  }, []);

  if (loading) return <LoadingScreen />;

  const acessarMonitoramento = (id: number) => {
    navigate(`/Monitoramento?id=${id}`);
  };

  const filteredAnimals = animals.filter((a) =>
    a.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="TelaAnimal">
      <div id="background-list">
        <div id="top-header">
          <h1 className="header">Animais</h1>

          <div className="notification" onClick={() => setShowNotifications(true)}>
            <Bell className="bell-icon" />
            {notifications.length > 0 && (
              <span className="notification-count">{notifications.length}</span>
            )}
          </div>
        </div>

        {/* Barra de busca */}
        <div id="search-container">
          <div className="search-bar">
            <Search className="icon search-icon" size={16} />
            <input
              type="text"
              placeholder="Pesquisar"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="animal-list">
          {filteredAnimals.map((animal) => {
            const mon = animal.monitoramento;

            return (
              <div
                key={animal.id}
                className="animal-item"
                onClick={() => acessarMonitoramento(animal.id)}
              >
                <div className="animal-card">
                  <div className="animal-avatar">
                    <img src={animal.avatar || "/avatars/default.png"} alt={animal.nome} />
                  </div>

                  <div className="animal-info">
                    <div className="animal-name">
                      {animal.nome}
                      {animal.starred && (
                        <img src={StarIcon} alt="Estrela" className="star-icon" />
                      )}
                    </div>

                    <div className="animal-type">
                      {getSpeciesName(animal.especie)}
                      <span className="gender">
                        {animal.sexo === "FEMEA" ? (
                          <img src={FemaleIcon} className="gender-icon" />
                        ) : animal.sexo === "MACHO" ? (
                          <img src={MaleIcon} className="gender-icon" />
                        ) : null}
                      </span>
                    </div>
                  </div>

                  {/* Ícones vitais */}
                  <div className="vital-icons">
                    <img src={getTempIcon(mon?.valor_temperatura)} className="vital-icon" />
                    <img
                      src={getHeartIcon(mon?.valor_frequencia_cardiaca)}
                      className="vital-icon"
                    />
                    <img
                      src={getOxygenIcon(mon?.valor_saturacao_oxigenio)}
                      className="vital-icon"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <FooterBar />

      <NotificationPopup
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
      />
    </div>
  );
}
