import { Search } from "lucide-react";
import "../styles/index.css";
import "../styles/list.css";
import StarIcon from "../assets/fav-icon.svg";
import Bell from "../assets/Bell-icon.svg"

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
//  Ajustado para aceitar 0 como valor válido.
// ======================
const tempLevel = (t?: number) => {
  // Permite 0, mas verifica estritamente undefined ou null
  if (t === undefined || t === null) return "INVÁLIDO";
  if (t <= 35.9) return "URGENTE";
  if (t >= 36.0 && t <= 37.4) return "ATENÇÃO";
  if (t >= 37.5 && t <= 39.5) return "SAUDÁVEL";
  if (t >= 39.6 && t <= 40.0) return "ATENÇÃO";
  if (t >= 40.1) return "URGENTE";
  return "SAUDÁVEL";
};

const heartLevel = (fc?: number) => {
  if (fc === undefined || fc === null) return "INVÁLIDO";
  if (fc <= 49) return "URGENTE";
  if (fc >= 50 && fc <= 59) return "ATENÇÃO";
  if (fc >= 60 && fc <= 100) return "SAUDÁVEL";
  if (fc >= 101 && fc <= 119) return "ATENÇÃO";
  if (fc >= 120) return "URGENTE";
  return "SAUDÁVEL";
};

const oxygenLevel = (o2?: number) => {
  if (o2 === undefined || o2 === null) return "INVÁLIDO";
  if (o2 <= 89) return "URGENTE";
  if (o2 >= 90 && o2 <= 94) return "ATENÇÃO";
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
  // Estado para controlar o loading da tela (apenas na primeira vez)
  const [loading, setLoading] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // ============================
  // FETCH COM TRATAMENTO COMPLETO
  // ============================
  const fetchAnimals = async (isInitialLoad = false) => {
    // Só exibe o loading na tela se for a primeira carga
    if (isInitialLoad) {
        setLoading(true);
    }
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

    // 🔔 GERA NOTIFICAÇÕES CONSOLIDADAS (Genéricas e Agrupadas)
    const generated: NotificationItem[] = [];
    const priority = { URGENTE: 3, ATENÇÃO: 2, SAUDÁVEL: 1, INVÁLIDO: 0 }; 

    merged.forEach((a) => {
      const m = a.monitoramento;
      if (!m) return;

      const tempStatus = tempLevel(m.valor_temperatura);
      const heartStatus = heartLevel(m.valor_frequencia_cardiaca);
      const oxygenStatus = oxygenLevel(m.valor_saturacao_oxigenio);

      // Determina o nível de prioridade mais alto
      const levels = [tempStatus, heartStatus, oxygenStatus]
        .filter((l): l is "URGENTE" | "ATENÇÃO" => l === "URGENTE" || l === "ATENÇÃO");

      if (levels.length === 0) return; // Sem alertas

      const highestLevel = levels.reduce((max, current) => 
        priority[current] > priority[max] ? current : max,
        "ATENÇÃO" as "ATENÇÃO" | "URGENTE"
      );

      // 4. CRIA A NOTIFICAÇÃO GENÉRICA
      generated.push({
        id: `consolidated-${a.id}`,
        title: `${a.nome} — ALERTA VITAL`, 
        level: highestLevel,
        message: `${a.nome} está em nível de **${highestLevel}**. Verifique o monitoramento.`,
        image: a.avatar || "/avatars/default.png",
        collar: a.id.toString(),
      });
    });

    setNotifications(generated);

    // Gerenciamento do Loading
    if (isInitialLoad) {
        const elapsed = Date.now() - start;
        const wait = 2000 - elapsed; // Aumentado para 2 segundos
        
        setTimeout(() => {
            setLoading(false);
            setInitialLoadDone(true); // Marca que o carregamento inicial de 2s terminou
        }, wait > 0 ? wait : 0);
    }
  };

  // ============================
  // REALTIME
  // ============================
  useEffect(() => {
    // 1. CHAMA O FETCH INICIAL COM FLAG PARA LOADING E DELAY
    fetchAnimals(true);

    // 2. LISTENERS REALTIME (não chamam setLoading(true) novamente)
    const animalCh = supabase
      .channel("animal_rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "animal" }, () => fetchAnimals(false))
      .subscribe();

    const monCh = supabase
      .channel("monitor_rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "monitoramento" }, () => fetchAnimals(false))
      .subscribe();

    return () => {
      supabase.removeChannel(animalCh);
      supabase.removeChannel(monCh);
    };
  }, []);

  // Exibe LoadingScreen apenas se 'loading' for true E 'initialLoadDone' for false
  // Note: O 'initialLoadDone' não é estritamente necessário se o 'useEffect' só chama o loading na primeira vez,
  // mas ajuda a garantir que o `fetchAnimals` só use o delay na chamada inicial.
  if (loading && !initialLoadDone) return <LoadingScreen />;

  const acessarMonitoramento = (id: number) => {
    // Adiciona delay de 2s antes de navegar
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        navigate(`/Monitoramento?id=${id}`);
    }, 2000);
  };

  const handleNotificationClick = (n: NotificationItem) => {
    // Se clicar numa notificação, abre o monitoramento do animal
    const id = Number(n.collar);
    if (id) {
      setShowNotifications(false);
      // Adiciona delay de 2s antes de navegar
      setLoading(true);
      setTimeout(() => {
          setLoading(false);
          navigate(`/Monitoramento?id=${id}`);
      }, 2000);
    }
  };

  const filteredAnimals = animals.filter((a) =>
    a.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Se 'loading' for true aqui (após clicar em algo), exibe a tela de loading
  if (loading) return <LoadingScreen />;

  return (
    <div className="TelaAnimal">
      <div id="background-list">
        <div id="top-header">
          <h1 className="header">Animais</h1>

          <div className="notification" onClick={() => setShowNotifications(true)}>
            <img src={Bell} className="bell-icon" />
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
                    </div>
                    <div className="animal-gender">
                      <span className="gender">
                        {animal.sexo === "FEMEA" ? (
                          <img src={FemaleIcon} className="gender-icon-list" />
                        ) : animal.sexo === "MACHO" ? (
                          <img src={MaleIcon} className="gender-icon-list" />
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