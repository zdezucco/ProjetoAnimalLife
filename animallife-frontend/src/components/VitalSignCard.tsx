import styled from "styled-components";
import grayHeart from "../assets/gray-heart.svg";
import greenHeart from "../assets/green-heart.svg";
import redHeart from "../assets/red-heart.svg";
import orangeHeart from "../assets/orange-heart.svg"

interface Monitoramento {
  id: string;
  valor_temperatura: number | null;
  valor_frequencia_cardiaca: number | null;
  valor_saturacao_oxigenio: number | null;
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
      <CardContainer style={{ backgroundColor: "var(--gray-temp)" }}>
        <CardHeader style={{ backgroundColor: "var(--gray-temp)" }}>
          Pulsação:
        </CardHeader>
        <CardContent>
          <span>Nenhum dado disponível</span>
        </CardContent>
      </CardContainer>
    );
  }

  const ultimo = monitoramentos[monitoramentos.length - 1];
  const bpm = ultimo.valor_frequencia_cardiaca;

  const bpmIsValid = typeof bpm === 'number' && bpm !== null;
  
  const validBpms = monitoramentos
    .map(m => m.valor_frequencia_cardiaca)
    .filter((fc): fc is number => typeof fc === 'number' && fc !== null && !isNaN(fc));

  const media = validBpms.length > 0 
    ? validBpms.reduce((acc, fc) => acc + fc, 0) / validBpms.length
    : 0;


  // Função que define o status, cor e ícone com base na temperatura
  const getVitalStatus = (bpm: number | null) => {
    if (bpm === undefined || bpm === null || bpm === 0)
      return {
        color: "var(--second-text-color)",
        textcolor: "var(--gray-temp)",
        status: "INVÁLIDO",
        icon: grayHeart,
      };
    if (bpm <= 49)
      return {
        color: "var(--warning-secundary)",
        textcolor: "var(--red-temp)",
        status: "URGENTE",
        icon: redHeart,
      };
    if (bpm >= 50 && bpm <= 59)
      return {
        color: "var(--attention-secundary)",
        textcolor: "var(--orange-temp)",
        status: "ATENÇÃO",
        icon: orangeHeart,
      };
    if (bpm >= 101 && bpm <= 120)
      return {
        color: "var(--attention-secundary)",
        textcolor: "var(--orange-temp)",
        status: "ATENÇÃO",
        icon: orangeHeart,
      };
    if (bpm >= 121)
      return {
        color: "var(--warning-secundary)",
        textcolor: "var(--red-temp)",
        status: "URGENTE",
        icon: redHeart,
      };
    return {
      color: "var(--healty-color)",
      textcolor: "var(--green-temp)",  
      status: "SAUDÁVEL",
      icon: greenHeart,
    };
  };

  const { color, textcolor, status, icon } = getVitalStatus(bpm);

  const displayBpm = bpmIsValid ? bpm.toFixed(1) : '';
  const displayMedia = validBpms.length > 0 ? media.toFixed(0) : ''; 

  return (
    <CardContainer style={{ backgroundColor: color }}>
      <CardHeader style={{ backgroundColor: color }}>Pulsação:</CardHeader>
      <CardContent>
        <LeftSection>
          <img src={icon} alt="Ícone Frequência Cardíaca" width={34} height={34} />
          <TemperateMedium>
            <Temperature style={{ color: textcolor }}>{displayBpm}bpm</Temperature>
            <Average style={{ color: textcolor }}>Média: {displayMedia}bpm</Average>
          </TemperateMedium>
        </LeftSection>
        <Status style={{ color: textcolor }}>{status}</Status>
      </CardContent>
    </CardContainer>
  );
};

export default VitalSignCard;

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
  width: 110px;
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
`;

const Average = styled.span`
  font-size: 14px;
  color: var(--secondary-color);
`;

const Status = styled.span`
  font-size: 22px;
  font-weight: bold;
  color: var(--secondary-color);
`;
