import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // ajusta o caminho conforme tua estrutura
import "../styles/infobox.css";

interface InfoBoxProps {
  animalId: number;
}

// Função para formatar nome da espécie (ex: "panthera_onca" → "Panthera Onca")
const formatEspecie = (text: string) => {
  if (!text) return "";
  return text
    .replace(/_/g, " ") // troca _ por espaço
    .replace(/\b\w/g, (char) => char.toUpperCase()); // deixa iniciais maiúsculas
};

const InfoBox = ({ animalId }: InfoBoxProps) => {
  const [animal, setAnimal] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [monitoramento, setMonitoramento] = useState<any[]>([]);

  // Busca dados do animal + registros
  useEffect(() => {
    const fetchAnimalData = async () => {
      const { data: animalData, error: animalError } = await supabase
        .from("animal")
        .select("*")
        .eq("id", animalId)
        .single();

      if (animalError) console.error(animalError);
      else {
        setAnimal(animalData);
        setFormData({
          ...animalData,
          especie: formatEspecie(animalData.especie),
        });
      }

      const { data: monitorData, error: monitorError } = await supabase
        .from("monitoramento")
        .select("*")
        .eq("id_animal", animalId)
        .order("data_monitoramento", { ascending: false });

      if (monitorError) console.error(monitorError);
      else setMonitoramento(monitorData);
    };

    if (animalId) fetchAnimalData();
  }, [animalId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from("animal")
      .update({
        nome: formData.nome,
        especie: formData.especie.replace(/\s+/g, "_").toLowerCase(), // salva com "_" novamente
        raca: formData.raca,
        peso: formData.peso,
        altura: formData.altura,
        comprimento: formData.comprimento,
      })
      .eq("id", animalId);

    if (error) {
      alert("Erro ao atualizar informações: " + error.message);
    } else {
      alert("Informações atualizadas com sucesso!");
      setAnimal(formData);
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

        <div className="button-row">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)}>Editar</button>
          ) : (
            <button onClick={handleSave}>Salvar alterações</button>
          )}
        </div>
      </div>

      <div className="checkboxes-section">
        <div className="checkbox-group">
          <label className="group-label">Dieta:</label>
          <div className="options">
            <label><input type="checkbox" checked={animal.dieta === "Herbívoro"} readOnly /> Herbívoro</label>
            <label><input type="checkbox" checked={animal.dieta === "Carnívoro"} readOnly /> Carnívoro</label>
            <label><input type="checkbox" checked={animal.dieta === "Onívoro"} readOnly /> Onívoro</label>
          </div>
        </div>
        <div className="checkbox-group">
          <label className="group-label">Sexo:</label>
          <div className="options">
            <label><input type="checkbox" checked={animal.sexo === "Macho"} readOnly /> Macho</label>
            <label><input type="checkbox" checked={animal.sexo === "Fêmea"} readOnly /> Fêmea</label>
          </div>
        </div>
      </div>

      <div className="register-box">
        <h3>Registro:</h3>
        <textarea
          readOnly
          value={
            monitoramento.length > 0
              ? monitoramento
                  .map(
                    (m) =>
                      `${new Date(m.data_monitoramento).toLocaleDateString()}: ${
                        m.observacoes || "Sem observações."
                      }`
                  )
                  .join("\n")
              : "Nenhum registro encontrado."
          }
        ></textarea>
      </div>
    </>
  );
};

export default InfoBox;
