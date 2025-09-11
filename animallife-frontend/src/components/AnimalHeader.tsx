import styled from "styled-components";
import { FaVenus, FaSyncAlt } from "react-icons/fa";

const AnimalHeader = () => {
  return (
    <HeaderContainer>
      <RefreshButton>
        <FaSyncAlt size={20} color="#57ab23" />
      </RefreshButton>
      <AnimalInfo>
        <AnimalName>INDIRA</AnimalName>
        <Species>Onça Pintada</Species>
      </AnimalInfo>
      <GenderIcon>
        <FaVenus size={20} color="white" />
        <GenderText>Fêmea</GenderText>
      </GenderIcon>
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
  background-color: #C2E5AD;
  border: none;
  cursor: pointer;
`;

const AnimalInfo = styled.div`
  text-align: center;
  margin-left: 42px;
`;

const AnimalName = styled.h2`
  margin: 0;
  font-size: 18px;
`;

const Species = styled.p`
  margin: 0;
  font-size: 12px;
`;

const GenderIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const GenderText = styled.span`
  font-size: 12px;
`;
