import styled from "styled-components";
import refresh from "../assets/refresh.svg";
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

const AnimalHeader: React.FC<AnimalHeaderProps> = ({ animal }) => {
  return (
    <HeaderContainer>
      <RefreshButton onClick={() => window.location.reload()}>
        <RefreshIcon> <img src={refresh} alt="Atualizar" /> </RefreshIcon>
      </RefreshButton>

      <AnimalInfo>
        <AnimalName>{animal.nome}</AnimalName>
        <Species>{getSpeciesName(animal.especie)}</Species>
      </AnimalInfo>

      <GenderSection>
        <GenderIcon>
          <img
            src={animal.sexo.toLowerCase() === "FEMEA" ? female : male}
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
  justify-content: space-between;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const RefreshButton = styled.button`
  width: 3rem;
  height: 3rem;
  background: #C2E5AD;
  border: none;
  cursor: pointer;
  border-radius:  25%;
`;

const RefreshIcon = styled.div`

`;

const AnimalInfo = styled.div`
  text-align: center;
`;

const AnimalName = styled.h2`
  margin: 0;
  font-size: 18px;
`;

const Species = styled.p`
  margin: 0;
  font-size: 12px;
`;

const GenderSection = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 25.2px;
  height: 25.2px;
`;

const GenderIcon = styled.div`
  width: 3rem;
  height: 3rem;
`;

const GenderText = styled.span`
  font-size: 12px;
  padding-right: 2rem;
`;
