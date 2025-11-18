import styled from "styled-components";
import AnimalHeader from "../components/AnimalHeader";
import "../styles/index.css";
import InfoBox from "../components/InfoBox";
import Header from "../components/Header";
import "../styles/novomonitoramento.css"
import FooterBar from "../components/FooterBar";
import { useSearchParams } from "react-router"
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
  const animalId = searchParams.get("id");

  // 🔵 Função que atualiza dados do animal
  const fetchAnimal = async () => {
    if (!animalId) return;

    const { data } = await supabase
      .from("animal")
      .select("*")
      .eq("id", animalId)
      .single();

    setAnimal(data);
  };

  // 🔵 Função que atualiza monitoramentos
  const fetchMonitoramentos = async () => {
    if (!animalId) return;

    const { data } = await supabase
      .from("monitoramento")
      .select("*")
      .eq("id_animal", animalId)
      .order("data_monitoramento", { ascending: false });

    setMonitoramentos(data || []);
  };

   // 🔵 Carrega dados iniciais
  useEffect(() => {
    fetchAnimal();
    fetchMonitoramentos();
  }, [animalId]);

  // 🟣 --- SUPABASE REALTIME ATIVO ---  
  useEffect(() => {
    if (!animalId) return;

    // 📌 Realtime para ANIMAL (foto, nome, sexo, registro)
    const animalChannel = supabase
      .channel(`animal_changes_${animalId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "animal", filter: `id=eq.${animalId}` },
        (payload) => {
          console.log("Realtime → Animal atualizado:", payload);
          fetchAnimal(); // atualiza automaticamente
        }
      )
      .subscribe();

    // 📌 Realtime para MONITORAMENTO (temperatura, pressão, oxigenação)
    const monitorChannel = supabase
      .channel(`monitor_changes_${animalId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "monitoramento",
          filter: `id_animal=eq.${animalId}`,
        },
        (payload) => {
          console.log("Realtime → Monitoramento atualizado:", payload);
          fetchMonitoramentos(); // atualiza automaticamente
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(animalChannel);
      supabase.removeChannel(monitorChannel);
    };
  }, [animalId]);

  if (!animal) return <LoadingScreen />;

  return (
    <>
      <PageContainer>
        <Header />
        <AnimalHeader animal={animal} />
        <Content>
          <TempSignCard monitoramentos={monitoramentos} />
          <VitalSignCard monitoramentos={monitoramentos} />
          <BloodSignCard monitoramentos={monitoramentos} />
        </Content>
        <InfoBox animalId={animal.id} />
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
  padding: 0px;
  margin-top: 20px;
  margin-bottom: -10px;
`;
