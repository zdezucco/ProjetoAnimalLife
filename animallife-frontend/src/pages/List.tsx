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
    valor_temperatura?: number;
    valor_frequencia_cardiaca?: number;
    valor_saturacao_oxigenio?: number;
    data_monitoramento?: string;
  };
}

// ======================
//  TEMPERATURA (icones usados na listagem — mantive helpers caso queira usar)
// ======================
const getTempIcon = (t: number | undefined) => {
  if (t === undefined || t === null) return grayTerm;
  if (t <= 35.9) return redTerm;
  if (t >= 36.0 && t <= 37.4) return orangeTerm;
  if (t >= 39.6 && t <= 40.0) return orangeTerm;
  if (t >= 40.1) return redTerm;
  return greenTerm;
};

// ======================
//  FREQUÊNCIA CARDÍACA
// ======================
const getHeartIcon = (fc: number | undefined) => {
  if (fc === undefined || fc === null) return grayHeart;
  if (fc <= 49) return redHeart;
  if (fc >= 50 && fc <= 59) return orangeHeart;
  if (fc >= 101 && fc <= 120) return orangeHeart;
  if (fc >= 121) return redHeart;
  return greenHeart;
};

// ======================
//  OXIGENAÇÃO
// ======================
const getOxygenIcon = (o2: number | undefined) => {
  if (o2 === undefined || o2 === null) return grayBlood;
  if (o2 <= 90) return redBlood;
  if (o2 >= 91 && o2 <= 94) return orangeBlood;
  return greenBlood;
};

// ======================
//  Funções que retornam nível/label (URGENTE | ATENÇÃO | SAUDÁVEL)
// ======================
const tempLevel = (t?: number) => {
  if (t === undefined || t === null) return "INVÁLIDO";
  if (t <= 36.0) return "URGENTE";
  if (t >= 36.1 && t <= 37.4) return "ATENÇÃO";
  if (t >= 37.5 && t <= 39.5) return "SAUDÁVEL";
  if (t >= 39.6 && t <= 40.0) return "ATENÇÃO";
  if (t >= 40.1) return "URGENTE";
  return "SAUDÁVEL";
};

const heartLevel = (fc?: number) => {
  if (fc === undefined || fc === null) return "INVÁLIDO";
  if (fc <= 50) return "URGENTE";
  if (fc >= 51 && fc <= 59) return "ATENÇÃO";
  if (fc >= 60 && fc <= 100) return "SAUDÁVEL";
  if (fc >= 101 && fc <= 119) return "ATENÇÃO";
  if (fc >= 120) return "URGENTE";
  return "SAUDÁVEL";
};

const oxygenLevel = (o2?: number) => {
  if (o2 === undefined || o2 === null) return "INVÁLIDO";
  if (o2 <= 90) return "URGENTE";
  if (o2 >= 91 && o2 <= 94) return "ATENÇÃO";
  if (o2 >= 95 && o2 <= 100) return "SAUDÁVEL";
  return "SAUDÁVEL";
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

    // 💡 TRATAMENTO FINAL DE ID + MERGE SEGURO (usa Number para evitar problemas de tipo)
    const merged: Animal[] = animalsRows.map((a: any) => {
      const idA = Number(a.id);
      const monitoramento = monitorRows.find((m: any) => Number(m.id_animal) === idA);
      return { ...a, monitoramento };
    });

    setAnimals(merged);

    // 🔔 GERA NOTIFICAÇÕES AUTOMÁTICAS (com title + message)
    const generated: NotificationItem[] = [];

    merged.forEach((a) => {
      const m = a.monitoramento;
      if (!m) return;

      // temperatura
      const tl = tempLevel(m.valor_temperatura);
      if (tl === "URGENTE" || tl === "ATENÇÃO") {
        generated.push({
          id: `temp-${a.id}-${m.data_monitoramento ?? ""}`,
          title: `${a.nome} — Temperatura`,
          level: tl as "URGENTE" | "ATENÇÃO",
          message:
            tl === "URGENTE"
              ? `${a.nome} apresenta temperatura em nível URGENTE (${m.valor_temperatura}°C).`
              : `${a.nome} apresenta variação de temperatura (${m.valor_temperatura}°C).`,
          image: a.avatar || "/avatars/default.png",
          collar: a.id.toString(),
        });
      }

      // frequencia cardiaca
      const hl = heartLevel(m.valor_frequencia_cardiaca);
      if (hl === "URGENTE" || hl === "ATENÇÃO") {
        generated.push({
          id: `fc-${a.id}-${m.data_monitoramento ?? ""}`,
          title: `${a.nome} — Frequência Cardíaca`,
          level: hl as "URGENTE" | "ATENÇÃO",
          message:
            hl === "URGENTE"
              ? `${a.nome} com frequência cardíaca em nível URGENTE (${m.valor_frequencia_cardiaca} bpm).`
              : `${a.nome} apresenta frequência cardíaca fora do intervalo (${m.valor_frequencia_cardiaca} bpm).`,
          image: a.avatar || "/avatars/default.png",
          collar: a.id.toString(),
        });
      }

      // oxigenacao
      const ol = oxygenLevel(m.valor_saturacao_oxigenio);
      if (ol === "URGENTE" || ol === "ATENÇÃO") {
        generated.push({
          id: `o2-${a.id}-${m.data_monitoramento ?? ""}`,
          title: `${a.nome} — Oxigenação`,
          level: ol as "URGENTE" | "ATENÇÃO",
          message:
            ol === "URGENTE"
              ? `${a.nome} com oxigenação em nível URGENTE (${m.valor_saturacao_oxigenio}%).`
              : `${a.nome} com oxigenação em atenção (${m.valor_saturacao_oxigenio}%).`,
          image: a.avatar || "/avatars/default.png",
          collar: a.id.toString(),
        });
      }
    });

    const priority = { URGENTE: 3, ATENÇÃO: 2 };

    const unique = Object.values(
      generated.reduce((acc, n) => {
        const animalId = n.collar;

        // Se é a primeira notificação do animal → salva
        if (!acc[animalId]) {
          acc[animalId] = n;
        } else {
          // Já existe outra → compara qual tem maior prioridade
          const current = acc[animalId];
          const incoming = n;

          if (priority[incoming.level] > priority[current.level]) {
            acc[animalId] = incoming;
          }
        }

        return acc;
      }, {} as Record<string, NotificationItem>)
    );


    setNotifications(unique);


    // Delay mínimo 1s
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

  const handleNotificationClick = (n: NotificationItem) => {
    // Se clicar numa notificação, abre o monitoramento do animal
    const id = Number(n.collar);
    if (id) {
      setShowNotifications(false);
      navigate(`/Monitoramento?id=${id}`);
    }
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
        onNotificationClick={handleNotificationClick}
      />
    </div>
  );
}
