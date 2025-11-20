import styled from "styled-components";
import female from "../assets/female-icon-white.svg";
import male from "../assets/male-icon-white.svg";

interface Animal {
  id: string;
  nome: string;
  especie: string;
  sexo: string;
}

interface AnimalHeaderProps {
  animal: Animal;
}


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
      // Transforma algo como "MACACO_PREGO" → "Macaco Prego"
      return especie
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
  }
};

// Função auxiliar para identificar o gênero corretamente
const isFemale = (sexo: string) => {
  if (!sexo) return false;
  const normalized = sexo.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // remove acentos
  return ["f", "femea", "fêmea"].includes(normalized.toLowerCase());
};

const AnimalHeader: React.FC<AnimalHeaderProps> = ({ animal }) => {
  return (
    <HeaderContainer>

      <Spacer />

      <AnimalInfo>
        <AnimalName>{animal.nome}</AnimalName>
        <Species>{getSpeciesName(animal.especie)}</Species>
      </AnimalInfo>

      <GenderSection>
        <GenderIcon>
          <img
            src={isFemale(animal.sexo) ? female : male}
            alt={animal.sexo}
          />
        </GenderIcon>
        <GenderText>{animal.sexo}</GenderText>
      </GenderSection>
    </HeaderContainer>
  );
};

export default AnimalHeader;

const HeaderContainer = styled.div`
  background-color: #227504;
  color: white;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;  /* ← Distribui os 3 lados */
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  width: 100%;
`;

const Spacer = styled.div`
  width: 40px; /* ocupa o espaço equivalente ao GenderSection para centrar */
`;

const AnimalInfo = styled.div`
  text-align: center;
  flex: 1; /* ← Isso garante que o centro realmente centralize */
`;

const AnimalName = styled.h2`
  margin: 0;
  font-size: 20px;
`;

const Species = styled.p`
  margin: 0;
  font-size: 16px;
`;

const GenderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5px;
  min-width: 40px;  /* largura mínima para não quebrar o layout */
`;

const GenderIcon = styled.div`
  width: 28px;
  height: 28px;
  
  img {
    width: 100%;
    height: 100%;
  }
`;

const GenderText = styled.span`
  font-size: 13px;
`;
