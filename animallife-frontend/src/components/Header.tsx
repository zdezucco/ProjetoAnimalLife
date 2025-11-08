import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import Editicon from "../assets/edit-icon.svg";
import Return from "../assets/return.svg";
import FavIcon from "../assets/fav-icon.svg";
import animalImage from "../assets/animal.svg";
import "../styles/header.css";
import { useNavigate } from "react-router";
import NotificationPopup, { NotificationItem } from "../components/NotificationPopup";
import { supabase } from "../supabaseClient";

interface Animal {
  id: number;
  nome: string;
  especie: string;
  sexo: string;
  registro: string;
  avatar?: string;
  monitoramento?: {
    valor_temperatura: number;
  };
}

const Header = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);

  const Retornar = () => {
    navigate("/List");
  };

  // 🔄 Alterna o modal de notificações
  const toggleNotifications = () => setShowNotifications((prev) => !prev);

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

      // 🔔 Gera notificações automáticas (igual à tela de Listagem)
      const generatedNotifications: NotificationItem[] = mergedData
        .filter((a) => {
          const t = a.monitoramento?.valor_temperatura;
          return (
            t !== undefined &&
            t !== null &&
            t !== 0 &&
            (t <= 35 || (t > 35 && t < 36) || t >= 40)
          );
        })
        .map((a, index) => {
          const temp = a.monitoramento?.valor_temperatura || 0;
          const level = temp <= 35 || temp > 41 ? "URGENTE" : "ATENÇÃO";

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

  // 🟡 Ao clicar em uma notificação, abrir a tela do respectivo animal
  const handleNotificationClick = (notification: NotificationItem) => {
    const animalId = Number(notification.collar);
    if (animalId) {
      setShowNotifications(false);
      navigate(`/Monitoramento?id=${animalId}`);
    }
  };

  return (
    <>
      <div className="header-container">
        <img
          src={Return}
          alt="Botão de voltar"
          className="icon-return"
          onClick={Retornar}
        />

        <div className="header-right">
          <div className="notification" onClick={toggleNotifications}>
            <Bell className="bell-icon" />
            {/* 🔔 Contador dinâmico */}
            {notifications.length > 0 && (
              <span className="notification-count">{notifications.length}</span>
            )}
          </div>
          <img src={FavIcon} alt="Ícone de Favorito" className="icon-star" />
        </div>
      </div>

      <div className="animal-photo-section">
        <div className="photo-wrapper">
          <img src={animalImage} alt="Animal" className="animal-photo" />
          <img src={Editicon} alt="Editar" className="edit-icon" />
        </div>
        <p className="animal-id">{}</p>
      </div>

      {/* 🔔 Popup de notificações idêntico à tela de Listagem */}
      <NotificationPopup
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
      />
    </>
  );
};

export default Header;
