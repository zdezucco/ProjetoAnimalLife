import { useEffect, useRef, useState, useCallback } from "react";
import Editicon from "../assets/edit-icon.svg";
import Return from "../assets/return.svg";
import "../styles/header.css";
import { useNavigate } from "react-router";
import NotificationPopup, { NotificationItem } from "../components/NotificationPopup";
import Bell from "../assets/bell-icon.svg";
import { supabase } from "../supabaseClient";

interface HeaderProps {
  selectedId?: number; // Para forçar ID vindo do Monitoramento
}

// Interface Animal ajustada para incluir os valores de monitoramento
interface Animal {
  id: number;
  nome: string;
  especie: string;
  sexo: string;
  registro: string;
  avatar?: string;
  monitoramento?: {
    valor_temperatura?: number;
    valor_frequencia_cardiaca?: number;
    valor_saturacao_oxigenio?: number;
    data_monitoramento?: string;
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

  // ======================
  //  FUNÇÕES DE NÍVEL DE ALERTA
  // ======================
  const tempLevel = (t?: number) => {
    if (t === undefined || t === null) return null;
    if (t <= 35.9) return "URGENTE";
    if (t >= 36.0 && t <= 37.4) return "ATENÇÃO";
    if (t >= 37.5 && t <= 39.5) return null;
    if (t >= 39.6 && t <= 40.0) return "ATENÇÃO";
    if (t >= 40.1) return "URGENTE";
    return null;
  };

  const heartLevel = (fc?: number) => {
    if (fc === undefined || fc === null) return null;
    if (fc <= 49) return "URGENTE";
    if (fc >= 50 && fc <= 59) return "ATENÇÃO";
    if (fc >= 60 && fc <= 100) return null;
    if (fc >= 101 && fc <= 119) return "ATENÇÃO";
    if (fc >= 120) return "URGENTE";
    return null;
  };

  const oxygenLevel = (o2?: number) => {
    if (o2 === undefined || o2 === null) return null;
    if (o2 <= 89) return "URGENTE";
    if (o2 >= 90 && o2 <= 94) return "ATENÇÃO";
    return null;
  };


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

  // 🟥 FUNÇÃO DE BUSCA E GERAÇÃO DE NOTIFICAÇÕES (USADA POR INIT E REALTIME)
  const fetchAnimals = useCallback(async () => {
    const { data: animalData } = await supabase.from("animal").select("*");
    const { data: monData } = await supabase
      .from("monitoramento")
      .select("*")
      .order("data_monitoramento", { ascending: false });

    const animalsArray = animalData || [];
    const monArray = monData || [];

    const merged: Animal[] = animalsArray.map((a: any) => ({
      ...a,
      // Encontra o monitoramento mais recente
      monitoramento: monArray.find((m: any) => Number(m.id_animal) === Number(a.id))
    }));

    setAnimals(merged);

    // 🔵 SELECIONAR ANIMAL
    const params = new URLSearchParams(window.location.search);
    const urlId = Number(params.get("id"));
    const forcedId = selectedId ?? urlId;
    const initial = merged.find((a) => a.id === forcedId) || merged[0] || null;

    setSelectedAnimal(initial);

    // 🔵 GERAR NOTIFICAÇÕES CONSOLIDADAS (GENÉRICAS)
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
      
      // CRIA A NOTIFICAÇÃO GENÉRICA
      generated.push({
        id: `consolidated-${a.id}`,
        title: `${a.nome} — ALERTA VITAL`, 
        level: highestLevel,
        // MENSAGEM GENÉRICA:
        message: `${a.nome} está em nível de **${highestLevel}**. Verifique o monitoramento.`,
        image: a.avatar || "/avatars/default.png",
        collar: a.id.toString(),
      });
    });

    // Usa as notificações geradas diretamente, pois já estão consolidadas
    setNotifications(generated); 
  }, [selectedId]); // Depende de selectedId

  // 1. EFEITO PARA BUSCA INICIAL (Chama a função fetchAnimals)
  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

  // 2. EFEITO PARA LISTENERS REALTIME (CORRIGIDO: Adiciona listeners)
  useEffect(() => {
    // Escutando mudanças na tabela 'animal'
    const animalCh = supabase
      .channel("animal_rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "animal" }, fetchAnimals)
      .subscribe();

    // Escutando mudanças na tabela 'monitoramento'
    const monCh = supabase
      .channel("monitor_rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "monitoramento" }, fetchAnimals)
      .subscribe();

    // Cleanup: Remove os listeners quando o componente for desmontado
    return () => {
      supabase.removeChannel(animalCh);
      supabase.removeChannel(monCh);
    };
  }, [fetchAnimals]); // Depende da função memoizada

  // 🔵 CLIQUE NA NOTIFICAÇÃO
  const handleNotificationClick = (notification: NotificationItem) => {
    // Adiciona o delay de 2s ANTES de navegar
    // Nota: O Header não tem estado 'loading' próprio para a tela inteira,
    // mas a navegação do List.tsx para o Monitoramento.tsx lida com isso.
    // Aqui, apenas garantimos a navegação.
    navigate(`/Monitoramento?id=${notification.collar}`);
    setShowNotifications(false);
  };

  const openFilePicker = () => fileInputRef.current?.click();

  return (
    <>
      <div className="header-container">
        <img src={Return} alt="Voltar" className="icon-return" onClick={Retornar} />

        <div className="notification" onClick={() => setShowNotifications(true)}>
            <img src={Bell} className="bell-icon" />
            {notifications.length > 0 && (
              <span className="notification-count">{notifications.length}</span>
            )}
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