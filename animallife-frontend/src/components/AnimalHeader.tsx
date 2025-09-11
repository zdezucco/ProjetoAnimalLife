import styled from "styled-components";
import refresh from "../assets/refresh.svg";
import female from "../assets/female-icon.svg";

const AnimalHeader = () => {
  return (
    <HeaderContainer>
      <RefreshButton>
        <img src={refresh} alt="Refresh"/>
      </RefreshButton>
      <AnimalInfo>
        <AnimalName>INDIRA</AnimalName>
        <Species>Onça Pintada</Species>
      </AnimalInfo>
      <GenderSection>
        <GenderIcon>
          <img src={female} alt="Female"/>
        </GenderIcon>
        <GenderText>Fêmea</GenderText>
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
  width: 1.513rem;
  height: 1.325rem;
  background: 3.188rem 3.188rem #C2E5AD;
  border: none;
  cursor: pointer;
  border-radius:  25%;
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

const GenderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  flex-direction: column;
  width: 25.2px;
  height: 25.2px;
`;

const GenderIcon = styled.div`
  width: 25.2px;
  height: 25.2px;
  color: white;
`;

const GenderText = styled.span`
  font-size: 12px;
`;
