import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // ajusta o caminho conforme tua estrutura
import "../styles/infobox.css";
import FemaleIcon from "../assets/female-icon.svg";
import MaleIcon from "../assets/male-icon.svg";

interface InfoBoxProps {
  animalId: number;
}

// Função para formatar nome da espécie (ex: "panthera_onca" → "Panthera Onca")
const formatEspecie = (text: string) => {
    if (!text) return "Desconhecido";

  switch (text.toUpperCase()) {
    case "ONCA_PINTADA":
      return "Onça Pintada";
    case "LOBO_GUARA":
      return "Lobo-Guará";
    case "ANTA":
      return "Anta";
    default:
      // Transforma algo como "MACACO_PREGO" → "Macaco Prego"
      return text
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
  }
};

const normalizeEspecie = (text: string) => {
  if (!text) return "";
  return text
    .normalize("NFD") // remove acentos
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/\s+/g, "_"); // troca espaços por "_"
};

const normalizeToDb = (text: string) => {
  if (!text) return "";
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
};

// Função auxiliar para formatar data e hora
const formatDateTime = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const InfoBox = ({ animalId }: InfoBoxProps) => {
  const [animal, setAnimal] = useState<any>(null);
  const [monitoramentoLogs, setMonitoramentoLogs] = useState<any[]>([]); // Estado para os logs
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  // Função para buscar os logs de monitoramento
  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from("monitoramento")
      .select("id, data_monitoramento, observacoes")
      .eq("id_animal", animalId)
      .order("data_monitoramento", { ascending: false }); // Mais recentes primeiro

    if (!error && data) {
      setMonitoramentoLogs(data);
    }
  };

  // 🔹 Buscar dados do animal
  useEffect(() => {
    const fetchAnimal = async () => {
      const { data, error } = await supabase
        .from("animal")
        .select("*")
        .eq("id", animalId)
        .single();

      if (error) {
        console.error("Erro ao buscar animal:", error);
        return;
      }

      // Formatamos para exibição amigável
      setAnimal(data);
      setFormData({
        ...data,
        especie: formatEspecie(data.especie),
        dieta:
          data.dieta === "HERBIVORO"
            ? "Herbívoro"
            : data.dieta === "CARNIVORO"
            ? "Carnívoro"
            : data.dieta === "ONIVORO"
            ? "Onívoro"
            : "",
        sexo:
          data.sexo === "MACHO"
            ? "Macho"
            : data.sexo === "FEMEA"
            ? "Fêmea"
            : "",
      });
    };

    if (animalId) {
      fetchAnimal();
      fetchLogs(); // Busca os logs iniciais

      // Inscreve no Realtime para atualizar a lista automaticamente
      const channel = supabase
        .channel(`monitoramento_logs_${animalId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "monitoramento",
            filter: `id_animal=eq.${animalId}`,
          },
          (payload) => {
            // Adiciona o novo log ao topo da lista
            setMonitoramentoLogs((prev) => [payload.new, ...prev]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [animalId]);
  
  // 🔹 Atualiza campos editáveis
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // 🔹 Atualiza checkboxes de dieta e sexo
  const handleCheckboxChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // 🔹 Salvar alterações no Supabase
  const handleSave = async () => {
  // 🧠 Se a espécie não foi alterada, mantém a original (formato do banco)
  const especieFinal =
    formData.especie === formatEspecie(animal.especie)
      ? animal.especie // já está normalizado no banco
      : normalizeEspecie(formData.especie);

  const updateData = {
    nome: formData.nome,
    especie: especieFinal, // ✅ agora garantido no formato do banco
    raca: formData.raca,
    peso: formData.peso,
    altura: formData.altura,
    comprimento: formData.comprimento,
    dieta: normalizeToDb(formData.dieta), // ✅ HERBIVORO / CARNIVORO / ONIVORO
    sexo: normalizeToDb(formData.sexo), // ✅ MACHO / FEMEA
  };

  const { error } = await supabase
    .from("animal")
    .update(updateData)
    .eq("id", animalId);

  if (error) {
    alert("❌ Erro ao atualizar: " + error.message);
  } else {
    alert("✅ Dados atualizados com sucesso!");
    setIsEditing(false);
  }
};

  if (!animal) return <p>Carregando informações...</p>;

  return (
    <>
      <div className="info-box-container">
        <h4>Informações</h4>

        <form className="info-form">
          <div className="form-group">
            <label htmlFor="nome">Nome:</label>
            <input
              id="nome"
              type="text"
              value={formData.nome || ""}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>

          <div className="form-group">
            <label htmlFor="especie">Espécie:</label>
            <input
              id="especie"
              type="text"
              value={formData.especie || ""}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>

          <div className="form-group">
            <label htmlFor="raca">Raça:</label>
            <input
              id="raca"
              type="text"
              value={formData.raca || ""}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="peso">Peso (Kg):</label>
              <input
                id="peso"
                type="text"
                value={formData.peso || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>

            <div className="form-group">
              <label htmlFor="comprimento">Comprimento (m):</label>
              <input
                id="comprimento"
                type="text"
                value={formData.comprimento || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="idade">Idade:</label>
              <input id="idade" type="text" value={formData.idade || ""} readOnly />
            </div>

            <div className="form-group">
              <label htmlFor="altura">Altura (m):</label>
              <input
                id="altura"
                type="text"
                value={formData.altura || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </form>

      {/* 🔹 DIETA e SEXO */}
      <div className="checkboxes-section">
        <div className="checkbox-group">
          <label className="group-label">Dieta:</label>
          <div className="options">
            {["Herbívoro", "Carnívoro", "Onívoro"].map((d) => (
              <label key={d}>
                <input
                  type="checkbox"
                  checked={formData.dieta === d}
                  disabled={!isEditing}
                  onChange={() => handleCheckboxChange("dieta", d)}
                />
                <span className="custom-checkbox"></span>
                {d}
              </label>
            ))}
          </div>
        </div>

        <div className="checkbox-group">
          <label className="group-label">Sexo:</label>
          <div className="options">
            {["Macho", "Fêmea"].map((s) => (
              <label key={s}>
                <input
                  type="checkbox"
                  checked={formData.sexo === s}
                  disabled={!isEditing}
                  onChange={() => handleCheckboxChange("sexo", s)}
                />
                <span className="custom-checkbox"></span>
                {s}
                {s === "Macho" && <img src={MaleIcon} alt="Macho" className="gender-icon" />}
                {s === "Fêmea" && <img src={FemaleIcon} alt="Fêmea" className="gender-icon" />}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="button-row">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)}>Editar</button>
          ) : (
            <button onClick={handleSave}>Salvar alterações</button>
          )}
        </div>
      </div>

{/* 🔹 REGISTRO DE MONITORAMENTO (LISTA) */}
      <div className="register-box">
        <h3>Registro de Monitoramento:</h3>
        
        <div className="monitor-log-container">
          {monitoramentoLogs.length === 0 ? (
            <p className="no-logs">Nenhum registro encontrado.</p>
          ) : (
            <ul className="monitor-log-list">
              {monitoramentoLogs.map((log) => (
                <li key={log.id} className="monitor-log-item">
                  <div className="log-header">
                    <strong>{formatDateTime(log.data_monitoramento)}</strong>
                  </div>
                  <p className="log-obs">
                    {log.observacoes ? log.observacoes : "Sem observações registradas."}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default InfoBox;