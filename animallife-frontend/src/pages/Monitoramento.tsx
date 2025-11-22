import styled from "styled-components";
import AnimalHeader from "../components/AnimalHeader";
import "../styles/index.css";
import InfoBox from "../components/InfoBox";
import Header from "../components/Header";
import "../styles/novomonitoramento.css";
import FooterBar from "../components/FooterBar";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import LoadingScreen from "../pages/Loadingscreen";
import TempSignCard from "../components/TempSignCard";
import VitalSignCard from "../components/VitalSignCard";
import BloodSignCard from "../components/BloodSignCard";

const Monitoramento = () => {
  const [searchParams] = useSearchParams();
  const [animal, setAnimal] = useState<any>(null);
  const [monitoramentos, setMonitoramentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); 
  const animalId = searchParams.get("id");

const monitoramentosOrdenados = [...monitoramentos]
  .sort((a, b) =>
    new Date(a.data_monitoramento).getTime() -
    new Date(b.data_monitoramento).getTime()
  );

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

  useEffect(() => {
    const start = Date.now();
    fetchData().then(() => {
        const elapsed = Date.now() - start;
        const wait = 1000 - elapsed; 
        
        setTimeout(() => {
            setLoading(false);
        }, wait > 0 ? wait : 0);
    });
  }, [animalId]);


  useEffect(() => {
    if (!animalId) return;

    const animalChannel = supabase
      .channel(`animal-updates-${animalId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "animal",
          filter: `id=eq.${animalId}`,
        },
        () => {
          console.log("🐶 Animal atualizado — recarregando...");
          fetchData();
        }
      )
      .subscribe();

    const monitoramentoChannel = supabase
      .channel(`monitoramento-updates-${animalId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "monitoramento",
          filter: `id_animal=eq.${animalId}`,
        },
        () => {
          console.log("📡 Monitoramento atualizado — recarregando...");
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(animalChannel);
      supabase.removeChannel(monitoramentoChannel);
    };
  }, [animalId]);

  if (loading || !animal) return <LoadingScreen />;

  return (
    <>
      <PageContainer>
        <Header selectedId={animal.id}/>
        <AnimalHeader animal={animal} />
        <Content>
          <TempSignCard monitoramentos={monitoramentosOrdenados} />
          <VitalSignCard monitoramentos={monitoramentosOrdenados} />
          <BloodSignCard monitoramentos={monitoramentosOrdenados} />
          <InfoBox animalId={animal.id} />
        </Content>
      </PageContainer>
      <FooterBar />
    </>
  );
};

export default Monitoramento;


const PageContainer = styled.div`
  background-color: var(--bg-primary-color);
  width: 100%;
  max-width: 480px;
  min-height: 100vh;
  border-radius: 25px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin: auto;
  padding: 10px;
`;

const Content = styled.div`
  padding: 0px 5px 0px 5px;
  margin-top: 20px;
  margin-bottom: -10px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px;
  border-color: 0.125rem var(#c5c5c5);
`;