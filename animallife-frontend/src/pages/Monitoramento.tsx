import styled from "styled-components";
import AnimalHeader from "../components/AnimalHeader";
import VitalSignCard from "../components/VitalSignCard";
import "../styles/index.css";
import InfoBox from "../components/InfoBox";
import Header from "../components/Header";
import "../styles/novomonitoramento.css"


const Monitoramento = () => {
  return (
    <>
    <GeneralContainer>
      <PageContainer>
        <Header />
        <AnimalHeader />
        <Content>
          <VitalSignCard />
        </Content>
        <InfoBox />
      </PageContainer>
    </GeneralContainer>
  </>
  );
};

export default Monitoramento;

const GeneralContainer = styled.div`
  padding: 400px;
`;  

const PageContainer = styled.div`
  background-color:var(--bg-primary-color);
  width: 360px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin: auto;
`;

const Content = styled.div`
  padding: 10px;
`;
