import styled from "styled-components";
import AnimalHeader from "../components/AnimalHeader";
import VitalSignCard from "../components/VitalSignCard";
import "../styles/index.css";
import InfoBox from "../components/InfoBox";
import Header from "../components/Header";
import "../styles/novomonitoramento.css"
import FooterBar from "../components/FooterBar";
import { useSearchParams } from "react-router"
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const Monitoramento = () => {
  const [searchParams] = useSearchParams();
  const [animal, setAnimal] = useState<any>(null);
  const [monitoramentos, setMonitoramentos] = useState<any[]>([]);
  const animalId = searchParams.get("id");

  useEffect(() => {
    const fetchData = async () => {
      if (!animalId) return;

      const { data: animalData } = await supabase
        .from("animal")
        .select("*")
        .eq("id", animalId)
        .single();

      const { data: monitoramentoData } = await supabase
        .from("monitoramento")
        .select("*")
        .eq("id_animal", animalId)
        .order("data_monitoramento", { ascending: false });

      setAnimal(animalData);
      setMonitoramentos(monitoramentoData || []);
    };

    fetchData();
  }, [animalId]);

  if (!animal) return <p>Carregando...</p>;

  return (
    <>
      <PageContainer>
        <Header />
        <AnimalHeader animal={animal} />
        <Content>
          <VitalSignCard monitoramentos={monitoramentos}/>
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
