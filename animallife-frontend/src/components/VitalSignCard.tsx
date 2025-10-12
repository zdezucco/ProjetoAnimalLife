import styled from "styled-components";
import { FaThermometerHalf } from "react-icons/fa";

interface Monitoramento {
  id: string;
  valor_temperatura: number;
  data_monitoramento: string;
  id_animal: string;
  observacoes?: string;
}

interface VitalSignCardProps {
  monitoramentos: Monitoramento[];
}

const VitalSignCard: React.FC<VitalSignCardProps> = ({ monitoramentos }) => {
  if (!monitoramentos || monitoramentos.length === 0) {
    return (
      <CardContainer>
        <CardHeader>Temperatura:</CardHeader>
        <CardContent>
          <span>Nenhum dado disponível</span>
        </CardContent>
      </CardContainer>
    );
  }

  const ultimo = monitoramentos[monitoramentos.length];
  const media =
    monitoramentos.reduce((acc, m) => acc + m.valor_temperatura, 0) /
    monitoramentos.length;

  const status =
    ultimo.valor_temperatura < 37
      ? "Baixa"
      : ultimo.valor_temperatura > 40
      ? "Alta"
      : "Saudável";

  return (
    <CardContainer>
      <CardHeader>Temperatura:</CardHeader>
      <CardContent>
        <LeftSection>
          <FaThermometerHalf size={20} color="var(--secondary-color)" />
          <TemperateMedium>
            <Temperature>{ultimo.valor_temperatura.toFixed(1)}°c</Temperature>
            <Average>Média: {media.toFixed(1)}°c</Average>
          </TemperateMedium>
        </LeftSection>
        <Status>{status}</Status>
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

const TemperateMedium = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  flex-direction: column;
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
