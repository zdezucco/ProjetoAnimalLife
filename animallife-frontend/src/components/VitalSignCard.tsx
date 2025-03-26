import styled from "styled-components";
import { FaThermometerHalf } from "react-icons/fa";

const VitalSignCard = () => {
  return (
    <CardContainer>
      <CardHeader>Temperatura:</CardHeader>
      <CardContent>
        <LeftSection>
          <FaThermometerHalf size={20} color="var(--secondary-color)" />
          <Temperature>39.5°c</Temperature>
        </LeftSection>
        <Average>Média: 38.2°c</Average>
        <Status>Saudável</Status>
      </CardContent>
    </CardContainer>
  );
};

export default VitalSignCard;

const CardContainer = styled.div`
  background-color: var(--healty-color);
  padding: 12px;
  border-radius: 10px;
  width: 100%;
  position: relative;
`;

const CardHeader = styled.div`
  font-weight: bold;
  color: var(--text-color);
  font-size: 14px;
  position: absolute;
  top: -8px;
  left: 10px;
  background: var(--healty-color);
  padding: 5px 10px;
  border-top-left-radius: 10px;
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Temperature = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: var(--secondary-color);
`;

const Average = styled.span`
  font-size: 12px;
  color: var(--secondary-color);
`;

const Status = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: var(--secondary-color);
`;
