import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EstadoDados from "../components/EstadoDados";
import { useAtividades } from "../context/AtividadesContext";

const diasSemana = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
const coresDisciplinas = ["#A878FF", "#58B9F2", "#53D6C4", "#F5B968"];

export default function AnalisesScreen() {
  const { atividades, carregando, erro, recarregar } = useAtividades();

  if (carregando || erro) {
    return <EstadoDados carregando={carregando} erro={erro} recarregar={recarregar} />;
  }

  const agora = new Date();
  const inicioSemana = new Date(agora);
  inicioSemana.setHours(0, 0, 0, 0);
  inicioSemana.setDate(inicioSemana.getDate() - ((inicioSemana.getDay() + 6) % 7));
  const fimSemana = new Date(inicioSemana);
  fimSemana.setDate(fimSemana.getDate() + 7);
  const atividadesSemana = atividades.filter(
    (atividade) => atividade.data && atividade.data >= inicioSemana && atividade.data < fimSemana,
  );
  const dadosSemana = diasSemana.map((dia, index) => ({
    dia,
    quantidade: atividadesSemana.filter(
      (atividade) => (atividade.data.getDay() + 6) % 7 === index,
    ).length,
  }));
  const maiorQuantidade = Math.max(1, ...dadosSemana.map((item) => item.quantidade));
  const disciplinas = [...new Set(atividades.map((atividade) => atividade.disciplina))];
  const contagemPorDisciplina = disciplinas
    .map((disciplina) => ({
      disciplina,
      quantidade: atividades.filter((atividade) => atividade.disciplina === disciplina).length,
    }))
    .sort((a, b) => b.quantidade - a.quantidade);
  const proximas = atividades.filter((atividade) => atividade.data && atividade.data >= agora).length;

  return (
    <ScrollView style={estilos.container} contentContainerStyle={estilos.conteudo}>
      <Text style={estilos.titulo}>Análises</Text>
      <Text style={estilos.subtitulo}>Resumo das atividades cadastradas</Text>

      <View style={estilos.progressoCard}>
        <View style={estilos.progressoTopo}>
          <View>
            <Text style={estilos.cardLabel}>TOTAL DE ATIVIDADES</Text>
            <Text style={estilos.progressoValor}>{atividades.length}</Text>
          </View>
          <View style={estilos.progressoIcon}>
            <Ionicons name="document-text-outline" size={23} color="#65D8BE" />
          </View>
        </View>
        <Text style={estilos.progressoLegenda}>
          {proximas} {proximas === 1 ? "atividade futura" : "atividades futuras"}
        </Text>
      </View>

      <View style={estilos.resumoRow}>
        <View style={estilos.resumoCard}>
          <View style={[estilos.resumoIcon, { backgroundColor: "#24203B" }]}>
            <Ionicons name="library-outline" size={19} color="#B591FF" />
          </View>
          <Text style={estilos.resumoValor}>{disciplinas.length}</Text>
          <Text style={estilos.resumoLabel}>Disciplinas</Text>
        </View>
        <View style={estilos.resumoCard}>
          <View style={[estilos.resumoIcon, { backgroundColor: "#183438" }]}>
            <Ionicons name="calendar-outline" size={19} color="#62D4C0" />
          </View>
          <Text style={estilos.resumoValor}>{atividadesSemana.length}</Text>
          <Text style={estilos.resumoLabel}>Esta semana</Text>
        </View>
      </View>

      <View style={estilos.chartCard}>
        <View style={estilos.cardHeading}>
          <Text style={estilos.tituloCard}>Atividade semanal</Text>
          <Text style={estilos.periodo}>Esta semana</Text>
        </View>
        <View style={estilos.chart}>
          {dadosSemana.map((item) => (
            <View style={estilos.chartColuna} key={item.dia}>
              <View style={estilos.chartTrilho}>
                <View
                  style={[
                    estilos.chartBarra,
                    { height: `${(item.quantidade / maiorQuantidade) * 100}%` },
                  ]}
                />
              </View>
              <Text style={estilos.chartDia}>{item.dia}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={estilos.chartCard}>
        <Text style={estilos.tituloCard}>Atividades por disciplina</Text>
        {contagemPorDisciplina.length ? contagemPorDisciplina.map((item, index) => (
          <View style={estilos.categoriaLinha} key={item.disciplina}>
            <View style={[estilos.categoriaDot, { backgroundColor: coresDisciplinas[index % coresDisciplinas.length] }]} />
            <Text style={estilos.categoriaNome}>{item.disciplina}</Text>
            <Text style={estilos.categoriaQuantidade}>{item.quantidade}</Text>
          </View>
        )) : (
          <Text style={estilos.semDados}>Nenhuma atividade cadastrada.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#08111F" },
  conteudo: { padding: 20, paddingTop: 16, paddingBottom: 32 },
  titulo: { color: "#F0F4FF", fontSize: 25, fontWeight: "700" },
  subtitulo: { color: "#9EABC2", fontSize: 14, marginTop: 5, marginBottom: 23 },
  progressoCard: { backgroundColor: "#24203B", borderColor: "#40375F", borderWidth: 1, borderRadius: 20, padding: 20 },
  progressoTopo: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardLabel: { color: "#B9A1FF", fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  progressoValor: { color: "#F3F0FF", fontSize: 42, fontWeight: "700", marginTop: 5 },
  progressoIcon: { width: 46, height: 46, borderRadius: 16, backgroundColor: "#193735", alignItems: "center", justifyContent: "center" },
  progressoLegenda: { color: "#BCB7D0", fontSize: 12, marginTop: 8 },
  resumoRow: { flexDirection: "row", gap: 12, marginTop: 14, marginBottom: 24 },
  resumoCard: { flex: 1, backgroundColor: "#101C2D", borderWidth: 1, borderColor: "#202D40", borderRadius: 17, padding: 15 },
  resumoIcon: { width: 34, height: 34, borderRadius: 11, alignItems: "center", justifyContent: "center", marginBottom: 13 },
  resumoValor: { color: "#EEF3FF", fontSize: 24, fontWeight: "700" },
  resumoLabel: { color: "#98A6BE", fontSize: 12, marginTop: 4 },
  chartCard: { backgroundColor: "#101C2D", borderWidth: 1, borderColor: "#202D40", borderRadius: 18, padding: 17, marginBottom: 14 },
  cardHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  tituloCard: { color: "#EAF0FF", fontSize: 15, fontWeight: "700" },
  periodo: { color: "#8F9DB4", fontSize: 11 },
  chart: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", height: 132, marginTop: 20 },
  chartColuna: { alignItems: "center", flex: 1, height: "100%", justifyContent: "flex-end" },
  chartTrilho: { width: 18, height: 105, justifyContent: "flex-end", backgroundColor: "#1C2A3D", borderRadius: 8, overflow: "hidden" },
  chartBarra: { width: "100%", backgroundColor: "#8D68E5", borderRadius: 8 },
  chartDia: { color: "#8998B1", fontSize: 9, fontWeight: "600", marginTop: 8 },
  categoriaLinha: { flexDirection: "row", alignItems: "center", paddingTop: 15 },
  categoriaDot: { width: 9, height: 9, borderRadius: 5, marginRight: 10 },
  categoriaNome: { flex: 1, color: "#BEC9DD", fontSize: 13 },
  categoriaQuantidade: { color: "#ECF1FF", fontSize: 13, fontWeight: "700" },
  semDados: { color: "#8D9BB2", fontSize: 13, paddingTop: 15 },
});
