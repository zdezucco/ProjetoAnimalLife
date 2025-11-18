import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import Editicon from "../assets/edit-icon.svg";
import Return from "../assets/return.svg";
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
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const Retornar = () => navigate("/List");

  const toggleNotifications = () => setShowNotifications((prev) => !prev);

  // 🟦 Carrega animais + monitoramentos
  useEffect(() => {
    const fetchAnimals = async () => {
      const { data: animalData, error: animalError } = await supabase
        .from("animal")
        .select("*");

      if (animalError) return console.error(animalError);

      const { data: monData, error: monError } = await supabase
        .from("monitoramento")
        .select("id_animal, valor_temperatura, data_monitoramento")
        .order("data_monitoramento", { ascending: false });

      if (monError) return console.error(monError);

      const merged = animalData.map((a) => ({
        ...a,
        monitoramento: monData.find((m) => m.id_animal === a.id),
      }));

      setAnimals(merged);

      // Define primeiro animal como selecionado
      if (merged.length > 0) setSelectedAnimal(merged[0]);

      // Notificações automáticas (igual list)
      const generated: NotificationItem[] = merged
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

      setNotifications(generated);
    };

    fetchAnimals();
  }, []);

  // 🟦 Ao clicar em notificação → abre o animal
  const handleNotificationClick = (notification: NotificationItem) => {
    const id = Number(notification.collar);
    setSelectedAnimal(animals.find((a) => a.id === id) || null);
    setShowNotifications(false);
    navigate(`/Monitoramento?id=${id}`);
  };

  // 🟧 Abrir seletor ao clicar no ícone de edição
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // 🟧 Upload no Supabase ao trocar imagem
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !selectedAnimal) return;

    const file = event.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `animal_${selectedAnimal.id}.${fileExt}`;
    const filePath = `${fileName}`;

    // 🔵 Upload no STORAGE
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Erro ao fazer upload:", uploadError);
      return;
    }

    // 🔵 Pegar URL pública
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    // 🔵 Atualizar no banco
    const { error: updateError } = await supabase
      .from("animal")
      .update({ avatar: publicUrl })
      .eq("id", selectedAnimal.id);

    if (updateError) {
      console.error("Erro ao atualizar avatar:", updateError);
      return;
    }

    // Atualiza localmente
    setSelectedAnimal((prev) => (prev ? { ...prev, avatar: publicUrl } : prev));
  };

  return (
    <>
      <div className="header-container">
        <img src={Return} alt="Botão de voltar" className="icon-return" onClick={Retornar} />

        <div className="header-right">
          <div className="notification" onClick={toggleNotifications}>
            <Bell className="bell-icon" />
            {notifications.length > 0 && (
              <span className="notification-count">{notifications.length}</span>
            )}
          </div>
        </div>
      </div>

      {/* 🟩 FOTO DO ANIMAL */}
      <div className="animal-photo-section">
        <div className="photo-wrapper">
          <img
            src={selectedAnimal?.avatar || "/avatars/default.png"}
            alt="Animal"
            className="animal-photo"
          />

          {/* Ícone de editar */}
          <img
            src={Editicon}
            alt="Editar"
            className="edit-icon"
            onClick={openFilePicker}
            style={{ cursor: "pointer" }}
          />

          {/* Input oculto */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </div>
      </div>

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
