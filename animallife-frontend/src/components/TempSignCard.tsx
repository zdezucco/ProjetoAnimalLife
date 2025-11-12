import styled from "styled-components";
import grayTerm from "../assets/gray-term-monit.svg";
import greenTerm from "../assets/green-term-monit.svg";
import redTerm from "../assets/red-term-monit.svg";
import orangeTerm from "../assets/orange-term-monit.svg";

interface Monitoramento {
  id: string;
  valor_temperatura: number;
  data_monitoramento: string;
  id_animal: string;
  observacoes?: string;
}

interface TempSignCardProps {
  monitoramentos: Monitoramento[];
}

const TempSignCard: React.FC<TempSignCardProps> = ({ monitoramentos }) => {
  if (!monitoramentos || monitoramentos.length === 0) {
    return (
      <CardContainer style={{ backgroundColor: "var(--gray-temp)" }}>
        <CardHeader style={{ backgroundColor: "var(--gray-temp)" }}>
          Temperatura:
        </CardHeader>
        <CardContent>
          <span>Nenhum dado disponível</span>
        </CardContent>
      </CardContainer>
    );
  }

  const ultimo = monitoramentos[monitoramentos.length - 1];
  const temp = ultimo.valor_temperatura;
  const media =
    monitoramentos.reduce((acc, m) => acc + m.valor_temperatura, 0) /
    monitoramentos.length;

  // Função que define o status, cor e ícone com base na temperatura
  const getTempStatus = (temp: number) => {
    if (temp === undefined || temp === null || temp === 0)
      return {
        color: "var(--second-text-color)",
        textcolor: "var(--gray-temp)",
        status: "INVÁLIDO",
        icon: grayTerm,
      };
    if (temp <= 35)
      return {
        color: "var(--warning-secundary)",
        textcolor: "var(--red-temp)",
        status: "URGENTE",
        icon: redTerm,
      };
    if (temp >= 35.1 && temp <= 36)
      return {
        color: "var(--attention-secundary)",
        textcolor: "var(--orange-temp)",
        status: "ATENÇÃO",
        icon: orangeTerm,
      };
    if (temp >= 40 && temp <= 41)
      return {
        color: "var(--attention-secundary)",
        textcolor: "var(--orange-temp)",
        status: "ATENÇÃO",
        icon: orangeTerm,
      };
    if (temp > 41)
      return {
        color: "var(--warning-secundary)",
        textcolor: "var(--red-temp)",
        status: "URGENTE",
        icon: redTerm,
      };
    return {
      color: "var(--healty-color)",
      textcolor: "var(--green-temp)",  
      status: "SAUDÁVEL",
      icon: greenTerm,
    };
  };

  const { color, textcolor, status, icon } = getTempStatus(temp);

  return (
    <CardContainer style={{ backgroundColor: color }}>
      <CardHeader style={{ backgroundColor: color }}>Temperatura:</CardHeader>
      <CardContent>
        <LeftSection>
          <img src={icon} alt="Ícone Termômetro" width={34} height={34} />
          <TemperateMedium>
            <Temperature style={{ color: textcolor }}>{temp.toFixed(1)}°c</Temperature>
            <Average style={{ color: textcolor }}>Média: {media.toFixed(1)}°c</Average>
          </TemperateMedium>
        </LeftSection>
        <Status style={{ color: textcolor }}>{status}</Status>
      </CardContent>
    </CardContainer>
  );
};

export default TempSignCard;

const CardContainer = styled.div`
  background-color: var(--healty-color);
  padding: 10px;
  margin: 5px 0px 10px 0px;
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
