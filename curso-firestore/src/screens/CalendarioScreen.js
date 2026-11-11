import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EstadoDados from "../components/EstadoDados";
import { useAtividades } from "../context/AtividadesContext";
import { formatarDataHora } from "../utils/atividades";

const nomesDias = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export default function CalendarioScreen() {
  const { atividades, carregando, erro, recarregar } = useAtividades();
  const [mes, setMes] = useState(() => new Date().getMonth());
  const [ano, setAno] = useState(() => new Date().getFullYear());
  const [diaSelecionado, setDiaSelecionado] = useState(() => new Date().getDate());

  if (carregando || erro) {
    return <EstadoDados carregando={carregando} erro={erro} recarregar={recarregar} />;
  }

  const quantidadeDias = new Date(ano, mes + 1, 0).getDate();
  const inicioMes = (new Date(ano, mes, 1).getDay() + 6) % 7;
  const atividadesDoMes = atividades.filter(
    (atividade) =>
      atividade.data &&
      atividade.data.getMonth() === mes &&
      atividade.data.getFullYear() === ano,
  );
  const diasComAtividade = new Set(atividadesDoMes.map((atividade) => atividade.data.getDate()));
  const eventosDoDia = atividadesDoMes.filter(
    (atividade) => atividade.data.getDate() === diaSelecionado,
  );
  const dias = [
    ...Array(inicioMes).fill(null),
    ...Array.from({ length: quantidadeDias }, (_, index) => index + 1),
  ];

  function mudarMes(direcao) {
    const data = new Date(ano, mes + direcao, 1);
    setMes(data.getMonth());
    setAno(data.getFullYear());
    setDiaSelecionado(null);
  }

  return (
    <ScrollView style={estilos.container} contentContainerStyle={estilos.conteudo}>
      <Text style={estilos.titulo}>Calendário</Text>
      <Text style={estilos.subtitulo}>Organize seus compromissos</Text>

      <View style={estilos.calendarCard}>
        <View style={estilos.mesHeader}>
          <Pressable style={estilos.monthButton} onPress={() => mudarMes(-1)} accessibilityLabel="Mês anterior">
            <Ionicons name="chevron-back" size={20} color="#D8E2F8" />
          </Pressable>
          <Text style={estilos.mesTitulo}>{nomesMeses[mes]} {ano}</Text>
          <Pressable style={estilos.monthButton} onPress={() => mudarMes(1)} accessibilityLabel="Próximo mês">
            <Ionicons name="chevron-forward" size={20} color="#D8E2F8" />
          </Pressable>
        </View>

        <View style={estilos.grade}>
          {nomesDias.map((dia) => (
            <Text style={estilos.diaSemana} key={dia}>{dia}</Text>
          ))}
          {dias.map((dia, index) => (
            <View style={estilos.celulaDia} key={`${dia || "vazio"}-${index}`}>
              {dia ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: dia === diaSelecionado }}
                  style={[estilos.diaBotao, dia === diaSelecionado && estilos.diaSelecionado]}
                  onPress={() => setDiaSelecionado(dia)}
                >
                  <Text style={[estilos.diaTexto, dia === diaSelecionado && estilos.diaTextoSelecionado]}>
                    {dia}
                  </Text>
                  {diasComAtividade.has(dia) ? (
                    <View style={[estilos.marcador, dia === diaSelecionado && estilos.marcadorSelecionado]} />
                  ) : null}
                </Pressable>
              ) : null}
            </View>
          ))}
        </View>
      </View>

      <View style={estilos.agendaHeader}>
        <View>
          <Text style={estilos.tituloAgenda}>Agenda do dia</Text>
          <Text style={estilos.dataAgenda}>
            {diaSelecionado
              ? `${diaSelecionado} de ${nomesMeses[mes]} de ${ano}`
              : `Selecione um dia de ${nomesMeses[mes]}`}
          </Text>
        </View>
        <View style={estilos.iconoAgenda}>
          <Ionicons name="calendar" size={19} color="#B9A1FF" />
        </View>
      </View>

      {eventosDoDia.length ? eventosDoDia.map((evento, index) => (
        <View style={estilos.evento} key={evento.id}>
          <View style={[estilos.eventoMarcador, index % 2 === 1 && estilos.eventoMarcadorVerde]} />
          <View style={estilos.eventoInfo}>
            <Text style={estilos.eventoTitulo}>{evento.descricao}</Text>
            <Text style={estilos.eventoDetalhe}>
              {formatarDataHora(evento.data)} • {evento.disciplina} • Prof. {evento.professor}
            </Text>
          </View>
        </View>
      )) : (
        <View style={estilos.vazio}>
          <Ionicons name="sunny-outline" size={28} color="#6F7D96" />
          <Text style={estilos.vazioTexto}>Nenhuma atividade para este dia.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#08111F" },
  conteudo: { padding: 20, paddingTop: 16, paddingBottom: 32 },
  titulo: { color: "#F0F4FF", fontSize: 25, fontWeight: "700" },
  subtitulo: { color: "#9EABC2", fontSize: 14, marginTop: 5, marginBottom: 23 },
  calendarCard: { backgroundColor: "#101C2D", borderColor: "#202D40", borderWidth: 1, borderRadius: 20, padding: 16 },
  mesHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  monthButton: { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: "#19263A" },
  mesTitulo: { color: "#EAF0FF", fontSize: 17, fontWeight: "700" },
  grade: { flexDirection: "row", flexWrap: "wrap" },
  diaSemana: { width: "14.2857%", textAlign: "center", color: "#7888A3", fontSize: 10, fontWeight: "700", paddingBottom: 12 },
  celulaDia: { width: "14.2857%", height: 43, alignItems: "center", justifyContent: "center" },
  diaBotao: { width: 36, height: 38, alignItems: "center", justifyContent: "center", borderRadius: 12 },
  diaSelecionado: { backgroundColor: "#7651CE" },
  diaTexto: { color: "#CFD8EB", fontSize: 13, fontWeight: "500" },
  diaTextoSelecionado: { color: "#FFFFFF", fontWeight: "700" },
  marcador: { position: "absolute", bottom: 3, width: 4, height: 4, borderRadius: 2, backgroundColor: "#A98AFF" },
  marcadorSelecionado: { backgroundColor: "#FFFFFF" },
  agendaHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 28, marginBottom: 14 },
  tituloAgenda: { color: "#EFF3FF", fontSize: 18, fontWeight: "700" },
  dataAgenda: { color: "#91A0B9", fontSize: 12, marginTop: 4 },
  iconoAgenda: { width: 38, height: 38, borderRadius: 13, backgroundColor: "#26213F", alignItems: "center", justifyContent: "center" },
  evento: { flexDirection: "row", alignItems: "center", backgroundColor: "#101C2D", borderWidth: 1, borderColor: "#202D40", borderRadius: 15, padding: 15, marginBottom: 10 },
  eventoMarcador: { width: 4, height: 38, borderRadius: 4, backgroundColor: "#A878FF", marginRight: 13 },
  eventoMarcadorVerde: { backgroundColor: "#53D6C4" },
  eventoInfo: { flex: 1 },
  eventoTitulo: { color: "#E9EFFD", fontSize: 14, fontWeight: "600" },
  eventoDetalhe: { color: "#91A0B9", fontSize: 12, marginTop: 5 },
  vazio: { alignItems: "center", paddingVertical: 30, gap: 10, backgroundColor: "#101C2D", borderRadius: 16 },
  vazioTexto: { color: "#8D9BB2", fontSize: 13 },
});
