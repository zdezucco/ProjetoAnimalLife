import styled from "styled-components";
import grayBlood from "../assets/blood-gray.svg";
import greenBlood from "../assets/blood-green.svg";
import redBlood from "../assets/blood-red.svg";
import orangeBlood from "../assets/blood-orange.svg";

interface Monitoramento {
  id: string;
  valor_temperatura: number;
  valor_frequencia_cardiaca: number;
  valor_saturacao_oxigenio: number;
  data_monitoramento: string;
  id_animal: string;
  observacoes?: string;
}

interface BloodSignCardProps {
  monitoramentos: Monitoramento[];
}

const BloodSignCard: React.FC<BloodSignCardProps> = ({ monitoramentos }) => {
  if (!monitoramentos || monitoramentos.length === 0) {
    return (
      <CardContainer style={{ backgroundColor: "var(--gray-temp)" }}>
        <CardHeader style={{ backgroundColor: "var(--gray-temp)" }}>
          Oxigenação:
        </CardHeader>
        <CardContent>
          <span>Nenhum dado disponível</span>
        </CardContent>
      </CardContainer>
    );
  }

  const ultimo = monitoramentos[monitoramentos.length - 1];
  const oxigen = ultimo.valor_saturacao_oxigenio;
  const media =
    monitoramentos.reduce((acc, m) => acc + m.valor_saturacao_oxigenio, 0) /
    monitoramentos.length;

  // Função que define o status, cor e ícone com base na temperatura
  const getBloodStatus = (oxigen: number) => {
    if (oxigen === undefined || oxigen === null || oxigen === 0)
      return {
        color: "var(--second-text-color)",
        textcolor: "var(--gray-temp)",
        status: "INVÁLIDO",
        icon: grayBlood,
      };
    if (oxigen <= 89)
      return {
        color: "var(--warning-secundary)",
        textcolor: "var(--red-temp)",
        status: "URGENTE",
        icon: redBlood,
      };
    if (oxigen >= 90 && oxigen <= 94)
      return {
        color: "var(--attention-secundary)",
        textcolor: "var(--orange-temp)",
        status: "ATENÇÃO",
        icon: orangeBlood,
      };
    return {
      color: "var(--healty-color)",
      textcolor: "var(--green-temp)",  
      status: "SAUDÁVEL",
      icon: greenBlood,
    };
  };

  const { color, textcolor, status, icon } = getBloodStatus(oxigen);

  return (
    <CardContainer style={{ backgroundColor: color }}>
      <CardHeader style={{ backgroundColor: color }}>Oxigenação:</CardHeader>
      <CardContent>
        <LeftSection>
          <img src={icon} alt="Ícone Saturação de Oxigênio" width={34} height={34} />
          <TemperateMedium>
            <Temperature style={{ color: textcolor }}>{oxigen.toFixed(1)}%</Temperature>
            <Average style={{ color: textcolor }}>Média: {media.toFixed(0)}%</Average>
          </TemperateMedium>
        </LeftSection>
        <Status style={{ color: textcolor }}>{status}</Status>
      </CardContent>
    </CardContainer>
  );
};

export default BloodSignCard;

const CardContainer = styled.div`
  background-color: var(--healty-color);
  padding: 10px;
  margin: 5px 0px 20px 0px;
  border-radius: 10px;
  width: 100%;
  position: relative;
`;

const CardHeader = styled.div`
  font-weight: bold;
  color: var(--text-color);
  font-size: 14px;
  position: absolute;
  top: -13px;
  left: 0px;
  background: var(--healty-color);
  padding: 5px 10px;
  border-radius: 10px;
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
  gap: 0px;
  flex-direction: column;
  margin-left: 10px;
`;

const Temperature = styled.span`
  font-size: 22px;
  font-weight: bold;
  color: var(--secondary-color);
  margin-left: -11px;
`;

const Average = styled.span`
  font-size: 14px;
  color: var(--secondary-color);
`;

const Status = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: var(--secondary-color);
`;
