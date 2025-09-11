import styled from "styled-components";
import AnimalHeader from "../components/AnimalHeader";
import VitalSignCard from "../components/VitalSignCard";
import "../styles/index.css";
import InfoBox from "../components/InfoBox";
import Header from "../components/Header";
import "../styles/novomonitoramento.css"
import FooterBar from "../components/FooterBar";


const Monitoramento = () => {
  
  return (
    <>
      <PageContainer>
        <Header />
        <AnimalHeader />
        <Content>
          <VitalSignCard />
        </Content>
        <InfoBox />
      </PageContainer>
      <FooterBar />
  </>
  );
};

export default Monitoramento;

const PageContainer = styled.div`
  background-color:var(--bg-primary-color);
  width: 100%; 
  max-width: 480px;
  min-height: 100vh;
  border-radius: 25px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin: auto;
  padding: 5px
`;

const Content = styled.div`
  padding: 10px;
`;
