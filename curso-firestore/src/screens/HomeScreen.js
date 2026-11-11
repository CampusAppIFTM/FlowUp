import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EstadoDados from "../components/EstadoDados";
import { useAtividades } from "../context/AtividadesContext";
import { formatarDataHora, ordenarPorData } from "../utils/atividades";

const coresAtividades = ["#55B9F5", "#54D5BD", "#AD81FF"];

export default function HomeScreen({ navigation }) {
  const { atividades, carregando, erro, recarregar } = useAtividades();

  if (carregando || erro) {
    return <EstadoDados carregando={carregando} erro={erro} recarregar={recarregar} />;
  }

  const agora = new Date();
  const limiteSemana = new Date(agora);
  limiteSemana.setDate(limiteSemana.getDate() + 7);
  const futuras = ordenarPorData(atividades.filter((atividade) => atividade.data >= agora));
  const proximasSemana = futuras.filter((atividade) => atividade.data <= limiteSemana).length;
  const disciplinas = new Set(atividades.map((atividade) => atividade.disciplina)).size;

  return (
    <ScrollView style={estilos.container} contentContainerStyle={estilos.conteudo}>
      <View style={estilos.header}>
        <View>
          <Text style={estilos.saudacao}>Olá, estudante 👋</Text>
          <Text style={estilos.subtitulo}>Pronto para organizar sua rotina?</Text>
        </View>
        <View style={estilos.avatar}>
          <Ionicons name="person-outline" size={22} color="#B9A1FF" />
        </View>
      </View>

      <View style={estilos.destaque}>
        <View style={estilos.destaqueTopo}>
          <View style={estilos.iconeDestaque}>
            <Ionicons name="flash" size={20} color="#D8CBFF" />
          </View>
          <Text style={estilos.destaqueLabel}>SEU RESUMO</Text>
        </View>
        <Text style={estilos.destaqueTitulo}>Sua rotina de estudos</Text>
        <Text style={estilos.destaqueDescricao}>
          Acompanhe seus prazos e organize suas atividades.
        </Text>
        <View style={estilos.stats}>
          <View style={estilos.stat}>
            <Text style={estilos.statValor}>{atividades.length}</Text>
            <Text style={estilos.statLabel}>Atividades</Text>
          </View>
          <View style={estilos.divisor} />
          <View style={estilos.stat}>
            <Text style={estilos.statValor}>{proximasSemana}</Text>
            <Text style={estilos.statLabel}>Esta semana</Text>
          </View>
          <View style={estilos.divisor} />
          <View style={estilos.stat}>
            <Text style={estilos.statValor}>{disciplinas}</Text>
            <Text style={estilos.statLabel}>Disciplinas</Text>
          </View>
        </View>
      </View>

      <View style={estilos.secaoTopo}>
        <Text style={estilos.tituloSecao}>Próximas atividades</Text>
        <Pressable onPress={() => navigation.navigate("Atividades")}>
          <Text style={estilos.link}>Ver todas</Text>
        </Pressable>
      </View>

      {futuras.slice(0, 3).map((atividade, index) => {
        const cor = coresAtividades[index % coresAtividades.length];

        return (
          <View style={estilos.activityCard} key={atividade.id}>
            <View style={[estilos.activityIcon, { backgroundColor: `${cor}20` }]}>
              <Ionicons name="document-text-outline" size={20} color={cor} />
            </View>
            <View style={estilos.activityInfo}>
              <Text style={estilos.activityTitle}>{atividade.descricao}</Text>
              <Text style={estilos.activityDate}>
                {formatarDataHora(atividade.data)} • {atividade.professor}
              </Text>
            </View>
            <View style={[estilos.tag, { backgroundColor: `${cor}20` }]}>
              <Text style={[estilos.tagText, { color: cor }]}>{atividade.disciplina}</Text>
            </View>
          </View>
        );
      })}
      {!futuras.length ? (
        <View style={estilos.emptyState}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#7C8BA4" />
          <Text style={estilos.emptyText}>Nenhuma atividade futura cadastrada.</Text>
        </View>
      ) : null}

      <Pressable
        style={estilos.calendarioLink}
        onPress={() => navigation.navigate("Calendário")}
      >
        <Ionicons name="calendar-outline" size={20} color="#B9A1FF" />
        <Text style={estilos.calendarioLinkText}>Abrir meu calendário</Text>
        <Ionicons name="arrow-forward" size={18} color="#B9A1FF" />
      </Pressable>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#08111F" },
  conteudo: { padding: 20, paddingTop: 16, paddingBottom: 32 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
  saudacao: { color: "#F0F4FF", fontSize: 24, fontWeight: "700" },
  subtitulo: { color: "#9EABC2", fontSize: 14, marginTop: 5 },
  avatar: { width: 44, height: 44, borderRadius: 16, backgroundColor: "#25213E", alignItems: "center", justifyContent: "center" },
  destaque: { backgroundColor: "#24203B", borderColor: "#40375F", borderWidth: 1, borderRadius: 22, padding: 20, marginBottom: 28 },
  destaqueTopo: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  iconeDestaque: { width: 34, height: 34, borderRadius: 11, backgroundColor: "#39305B", alignItems: "center", justifyContent: "center", marginRight: 10 },
  destaqueLabel: { color: "#BDA4FF", fontSize: 11, fontWeight: "700", letterSpacing: 1 },
  destaqueTitulo: { color: "#F3F0FF", fontSize: 21, fontWeight: "700" },
  destaqueDescricao: { color: "#BBB6D2", fontSize: 13, lineHeight: 20, marginTop: 7 },
  stats: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 22, paddingTop: 16, borderTopWidth: 1, borderTopColor: "#40395A" },
  stat: { flex: 1, alignItems: "center" },
  statValor: { color: "#F1EDFF", fontSize: 20, fontWeight: "700" },
  statLabel: { color: "#A8A3BC", fontSize: 11, marginTop: 5 },
  divisor: { width: 1, height: 32, backgroundColor: "#48415F" },
  secaoTopo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  tituloSecao: { color: "#EFF3FF", fontSize: 18, fontWeight: "700" },
  link: { color: "#B9A1FF", fontSize: 13, fontWeight: "600" },
  activityCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#101C2D", borderWidth: 1, borderColor: "#202D40", borderRadius: 16, padding: 12, marginBottom: 10 },
  activityIcon: { width: 42, height: 42, borderRadius: 13, alignItems: "center", justifyContent: "center", marginRight: 12 },
  activityInfo: { flex: 1 },
  activityTitle: { color: "#E6EDFC", fontSize: 14, fontWeight: "600" },
  activityDate: { color: "#9AA8C0", fontSize: 12, marginTop: 5 },
  tag: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 99 },
  tagText: { fontSize: 9, fontWeight: "700" },
  emptyState: { alignItems: "center", gap: 10, paddingVertical: 24 },
  emptyText: { color: "#8D9BB2", fontSize: 13 },
  calendarioLink: { flexDirection: "row", alignItems: "center", gap: 10, padding: 15, marginTop: 10, borderWidth: 1, borderColor: "#30294B", borderRadius: 15 },
  calendarioLinkText: { flex: 1, color: "#D8D0F1", fontSize: 14, fontWeight: "600" },
});
