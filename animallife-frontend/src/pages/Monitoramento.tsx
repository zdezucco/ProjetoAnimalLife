import styled from "styled-components";
import AnimalHeader from "../components/AnimalHeader";
import VitalSignCard from "../components/VitalSignCard";
import "../styles/index.css";


const Monitoramento = () => {
  return (
    <PageContainer>
      <AnimalHeader />
      <Content>
        <VitalSignCard />
      </Content>
    </PageContainer>
  );
};

export default Monitoramento;

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
