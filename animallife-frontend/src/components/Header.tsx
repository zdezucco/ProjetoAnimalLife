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

  const [showPreview, setShowPreview] = useState(false); // 🟦 PREVIEW DA IMAGEM

  const Retornar = () => navigate("/List");
  const toggleNotifications = () => setShowNotifications((prev) => !prev);

  // 🟦 Função para reduzir imagem antes do upload
  const resizeImage = (file: File, maxWidth = 500, maxHeight = 500): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);

            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          "image/jpeg",
          0.8
        );
      };

      reader.readAsDataURL(file);
    });
  };

  // 🟧 UPLOAD + compressão + atualização
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !selectedAnimal) return;

    const originalFile = event.target.files[0];

    // 🔵 Comprime a imagem antes do upload
    const compressedFile = await resizeImage(originalFile);

    const fileExt = compressedFile.name.split(".").pop();
    const fileName = `animal_${selectedAnimal.id}_${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, compressedFile, { upsert: true });

    if (uploadError) {
      console.error("Erro ao fazer upload:", uploadError);
      return;
    }

    // URL pública
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const publicUrl = urlData.publicUrl;

    // Atualiza no banco
    await supabase.from("animal").update({ avatar: publicUrl }).eq("id", selectedAnimal.id);

    // Atualiza em tela
    setSelectedAnimal((prev) => (prev ? { ...prev, avatar: publicUrl } : prev));
    setAnimals((prev) =>
      prev.map((a) => (a.id === selectedAnimal.id ? { ...a, avatar: publicUrl } : a))
    );
  };

  useEffect(() => {
  const fetchAnimals = async () => {
    try {
      const { data: animalData, error: animalError } = await supabase
        .from("animal")
        .select("*");

      if (animalError) {
        console.error("Erro ao buscar animais:", animalError);
        return;
      }

      const { data: monData, error: monError } = await supabase
        .from("monitoramento")
        .select("id_animal, valor_temperatura, data_monitoramento")
        .order("data_monitoramento", { ascending: false });

      if (monError) {
        console.error("Erro ao buscar monitoramentos:", monError);
        return;
      }

      // usa array vazio como fallback caso alguma das respostas seja null/undefined
      const animalsArray = Array.isArray(animalData) ? animalData : [];
      const monArray = Array.isArray(monData) ? monData : [];

      const merged = animalsArray.map((a) => ({
        ...a,
        monitoramento: monArray.find((m) => m.id_animal === a.id) || null,
      }));

      setAnimals(merged);

      // seleciona animal pela url (se houver) — mesmo fallback seguro
      const params = new URLSearchParams(window.location.search);
      const urlId = Number(params.get("id"));
      if (urlId) {
        const found = merged.find((x) => x.id === urlId);
        if (found) setSelectedAnimal(found);
        else if (merged.length > 0) setSelectedAnimal(merged[0]);
      } else if (merged.length > 0) {
        setSelectedAnimal(merged[0]);
      }

      // gera notificações com base no monitoramento (se existir)
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
        .map((a) => {
          const temp = a.monitoramento?.valor_temperatura || 0;
          const level = temp <= 35 || temp > 41 ? "URGENTE" : "ATENÇÃO";

          return {
            id: a.id,
            level,
            message:
              level === "URGENTE"
                ? `${a.nome} está com alerta extremo de saúde!`
                : `${a.nome} apresenta variação de temperatura.`,
            image: a.avatar || "/avatars/default.png",
            collar: a.id.toString(),
          };
        });

      setNotifications(generated);
    } catch (err) {
      console.error("Erro inesperado ao buscar dados:", err);
    }
  };

  fetchAnimals();
}, []);


  // 🟦 Ao clicar em notificação → abre monitoramento
  const handleNotificationClick = (notification: NotificationItem) => {
    const id = Number(notification.collar);
    setSelectedAnimal(animals.find((a) => a.id === id) || null);
    setShowNotifications(false);
    navigate(`/Monitoramento?id=${id}`);
  };

  const openFilePicker = () => fileInputRef.current?.click();

  return (
    <>
      <div className="header-container">
        <img src={Return} alt="Voltar" className="icon-return" onClick={Retornar} />

        <div className="header-right">
          <div className="notification" onClick={toggleNotifications}>
            <Bell className="bell-icon" />
            {notifications.length > 0 && (
              <span className="notification-count">{notifications.length}</span>
            )}
          </div>
        </div>
      </div>

      {/* FOTO DO ANIMAL */}
      <div className="animal-photo-section">
        <div className="photo-wrapper" onClick={() => setShowPreview(true)}>
          <img
            src={selectedAnimal?.avatar || "/avatars/default.png"}
            alt="Animal"
            className="animal-photo"
          />

          {/* Ícone editar */}
          <img
            src={Editicon}
            alt="Editar"
            className="edit-icon"
            onClick={(e) => {
              e.stopPropagation();
              openFilePicker();
            }}
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

      {/* 🟦 MODAL DE PRÉ-VISUALIZAÇÃO */}
      {showPreview && (
        <div className="preview-overlay" onClick={() => setShowPreview(false)}>
          <img
            src={selectedAnimal?.avatar}
            alt="Preview"
            className="preview-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

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
