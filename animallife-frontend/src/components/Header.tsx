import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import Editicon from "../assets/edit-icon.svg";
import Return from "../assets/return.svg";
import "../styles/header.css";
import { useNavigate } from "react-router";
import NotificationPopup, { NotificationItem } from "../components/NotificationPopup";
import { supabase } from "../supabaseClient";

interface HeaderProps {
  selectedId?: number; // Para forçar ID vindo do Monitoramento
}

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

const Header = ({ selectedId }: HeaderProps) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [_animals, setAnimals] = useState<Animal[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPreview, setShowPreview] = useState(false);

  const Retornar = () => navigate("/List");
  const toggleNotifications = () => setShowNotifications((prev) => !prev);

  // 🟦 COMPACTAR IMAGEM
  const resizeImage = (file: File, maxWidth = 500, maxHeight = 500): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => (img.src = e.target?.result as string);

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
            resolve(new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() }));
          },
          "image/jpeg",
          0.8
        );
      };

      reader.readAsDataURL(file);
    });
  };

  // 🟧 UPLOAD DE IMAGEM DO ANIMAL
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !selectedAnimal) return;

    const compressedFile = await resizeImage(event.target.files[0]);
    const ext = compressedFile.name.split(".").pop();
    const fileName = `animal_${selectedAnimal.id}_${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, compressedFile, { upsert: true });

    if (uploadError) return console.error("Erro upload:", uploadError);

    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
    const publicUrl = data.publicUrl;

    await supabase.from("animal").update({ avatar: publicUrl }).eq("id", selectedAnimal.id);

    setSelectedAnimal((prev) => (prev ? { ...prev, avatar: publicUrl } : prev));
    setAnimals((prev) => prev.map((a) => (a.id === selectedAnimal.id ? { ...a, avatar: publicUrl } : a)));
  };

  // 🟥 BUSCA + UNIFICAÇÃO DE NOTIFICAÇÕES
  useEffect(() => {
    const fetchAnimals = async () => {
      const { data: animalData } = await supabase.from("animal").select("*");
      const { data: monData } = await supabase
        .from("monitoramento")
        .select("*")
        .order("data_monitoramento", { ascending: false });

      const animalsArray = animalData || [];
      const monArray = monData || [];

      const merged = animalsArray.map((a) => ({
        ...a,
        monitoramento: monArray.find((m) => m.id_animal === a.id) || null,
      }));

      setAnimals(merged);

      // 🔵 SELECIONAR ANIMAL
      const params = new URLSearchParams(window.location.search);
      const urlId = Number(params.get("id"));
      const forcedId = selectedId ?? urlId;
      const initial = merged.find((a) => a.id === forcedId) || merged[0] || null;

      setSelectedAnimal(initial);

      // 🔵 GERAR NOTIFICAÇÕES (AGORA COM 3 MÉTRICAS)
      const generated: NotificationItem[] = [];

      merged.forEach((a) => {
        const m = a.monitoramento;
        if (!m) return;

        // ===== TEMPERATURA =====
        const t = m.valor_temperatura;
        if (t !== undefined && t !== null) {
          let level: "URGENTE" | "ATENÇÃO" | null = null;

          if (t <= 35 || t >= 41) level = "URGENTE";
          else if (t > 35 && t < 41) level = "ATENÇÃO";

          if (level) {
            generated.push({
              id: `temp-${a.id}`,
              title: `${a.nome} — Temperatura`,
              level,
              message:
                level === "URGENTE"
                  ? `${a.nome} está com temperatura crítica (${t}°C).`
                  : `${a.nome} apresenta variação de temperatura (${t}°C).`,
              image: a.avatar || "/avatars/default.png",
              collar: a.id.toString(),
            });
          }
        }

        // ===== OXIGENAÇÃO =====
        const o = m.valor_saturacao_oxigenio;
        if (o !== undefined && o !== null) {
          let level: "URGENTE" | "ATENÇÃO" | null = null;

          if (o <= 90) level = "URGENTE";
          else if (o >= 91 && o <= 94) level = "ATENÇÃO";

          if (level) {
            generated.push({
              id: `o2-${a.id}`,
              title: `${a.nome} — Oxigenação`,
              level,
              message:
                level === "URGENTE"
                  ? `${a.nome} está com oxigenação crítica (${o}%).`
                  : `${a.nome} apresenta oxigenação fora do ideal (${o}%).`,
              image: a.avatar || "/avatars/default.png",
              collar: a.id.toString(),
            });
          }
        }

        // ===== BATIMENTOS =====
        const fc = m.valor_frequencia_cardiaca;
        if (fc !== undefined && fc !== null) {
          let level: "URGENTE" | "ATENÇÃO" | null = null;

          if (fc <= 50 || fc >= 120) level = "URGENTE";
          else if ((fc >= 51 && fc <= 59) || (fc >= 101 && fc <= 119)) level = "ATENÇÃO";

          if (level) {
            generated.push({
              id: `fc-${a.id}`,
              title: `${a.nome} — Frequência Cardíaca`,
              level,
              message:
                level === "URGENTE"
                  ? `${a.nome} está com batimentos cardíacos críticos (${fc} bpm).`
                  : `${a.nome} apresenta batimentos cardíacos irregulares (${fc} bpm).`,
              image: a.avatar || "/avatars/default.png",
              collar: a.id.toString(),
            });
          }
        }
      });

      // 🔵 Unificar (manter somente a mais urgente)
      const unique = Object.values(
        generated.reduce((acc, n) => {
          const animalId = n.collar;

          if (!acc[animalId]) {
            acc[animalId] = n;
          } else {
            const current = acc[animalId];
            const priority = { URGENTE: 2, ATENÇÃO: 1 };

            if (priority[n.level] > priority[current.level]) {
              acc[animalId] = n;
            }
          }
          return acc;
        }, {} as Record<string, NotificationItem>)
      );

      setNotifications(unique);

    };

    fetchAnimals();
  }, [selectedId]);

  // 🔵 CLIQUE NA NOTIFICAÇÃO
  const handleNotificationClick = (notification: NotificationItem) => {
    navigate(`/Monitoramento?id=${notification.id}`);
    setShowNotifications(false);
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

          <img
            src={Editicon}
            alt="Editar"
            className="edit-icon"
            onClick={(e) => {
              e.stopPropagation();
              openFilePicker();
            }}
          />

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </div>
      </div>

      {/* PREVIEW */}
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

      {/* POPUP DE NOTIFICAÇÕES */}
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
