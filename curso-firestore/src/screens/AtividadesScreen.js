import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EstadoDados from "../components/EstadoDados";
import { useAtividades } from "../context/AtividadesContext";
import { formatarDataHora } from "../utils/atividades";

const AtividadesScreen = () => {
  const { atividades, carregando, erro, recarregar } = useAtividades();
  const [disciplinaAtiva, setDisciplinaAtiva] = useState("Todas");

  if (carregando || erro) {
    return <EstadoDados carregando={carregando} erro={erro} recarregar={recarregar} />;
  }

  const disciplinas = [...new Set(atividades.map((atividade) => atividade.disciplina))];
  const tabs = ["Todas", ...disciplinas];
  const atividadesVisiveis = disciplinaAtiva === "Todas"
    ? atividades
    : atividades.filter((atividade) => atividade.disciplina === disciplinaAtiva);
  const cores = ["#372E5A", "#1D3247", "#163B3D"];

  const renderItem = ({ item, index }) => {
    const corCard = cores[index % cores.length];
    const corTag =
      index % cores.length === 1
        ? "#66D3E5"
        : index % cores.length === 2
          ? "#53D6C4"
          : "#A878FF";

    return (
      <View style={[estilos.card, { backgroundColor: corCard }]}>
        <View style={estilos.cardHeader}>
          <View style={estilos.iconContainer}>
            <Ionicons name="document-text-outline" size={26} color="#E7F0FF" />
          </View>

          <View style={estilos.textContainer}>
            <Text style={estilos.tituloCard}>{item.descricao}</Text>
            <Text style={estilos.descricaoCard}>{formatarDataHora(item.data)}</Text>
            <Text style={estilos.professorCard}>
              {item.disciplina} • Prof. {item.professor}
            </Text>
          </View>

          <View style={estilos.cardActions}>
            <View style={[estilos.tag, { backgroundColor: "rgba(10, 15, 30, 0.3)" }]}>
              <Text style={[estilos.tagText, { color: corTag }]}>{item.disciplina}</Text>
            </View>
            <Ionicons name="ellipsis-vertical" size={18} color="#D9E6FF" />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={estilos.container}>
      <View style={estilos.phoneFrame}>
        <View style={estilos.headerRow}>
          <Ionicons name="menu" size={30} color="#F3F6FF" />
          <Text style={estilos.tituloTela}>Atividades</Text>
          <Ionicons name="search" size={28} color="#F3F6FF" />
        </View>

        <View style={estilos.tabsRow}>
          {tabs.map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setDisciplinaAtiva(tab)}
              style={[estilos.tab, disciplinaAtiva === tab && estilos.tabAtiva]}
            >
              <Text style={[estilos.tabText, disciplinaAtiva === tab && estilos.tabTextAtiva]}>{tab}</Text>
            </Pressable>
          ))}
        </View>

        <FlatList
          data={atividadesVisiveis}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={estilos.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={estilos.listaVazia}>
              {atividades.length
                ? "Nenhuma atividade nesta disciplina."
                : "Nenhuma atividade cadastrada."}
            </Text>
          }
        />
      </View>
    </View>
  );
};

export default AtividadesScreen;

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a1224",
  },
  phoneFrame: {
    width: "100%",
    flex: 1,
    maxWidth: 520,
    alignSelf: "center",
    backgroundColor: "#0a1224",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    paddingHorizontal: 6,
  },
  tituloTela: {
    color: "#F5F7FF",
    fontSize: 25,
    fontWeight: "700",
    marginLeft: -10,
  },
  tabsRow: {
    flexDirection: "row",
    marginBottom: 14,
    gap: 8,
    paddingHorizontal: 2,
  },
  tab: {
    flex: 1,
    backgroundColor: "rgba(136, 143, 171, 0.10)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  tabAtiva: {
    backgroundColor: "rgba(91, 108, 170, 0.55)",
    borderWidth: 1,
    borderColor: "rgba(167, 186, 255, 0.25)",
  },
  tabText: {
    color: "#C7D1EE",
    fontSize: 12,
    fontWeight: "600",
  },
  tabTextAtiva: {
    color: "#F2F6FF",
  },
  listContent: {
    paddingBottom: 24,
    paddingTop: 8,
  },
  card: {
    borderRadius: 20,
    padding: 12,
    marginBottom: 14,
    shadowColor: "#0d1120",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(168, 178, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  tituloCard: {
    color: "#EEF4FF",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 2,
    marginBottom: 3,
  },
  descricaoCard: {
    color: "#D8E0F7",
    fontSize: 13,
    marginBottom: 8,
  },
  professorCard: {
    color: "#B8C6DF",
    fontSize: 12,
    marginBottom: 4,
  },
  cardActions: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    gap: 6,
  },
  tag: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 74,
    alignItems: "center",
    justifyContent: "center",
  },
  tagText: {
    color: "#EAF2FF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  listaVazia: {
    color: "#9EABC2",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 32,
  },
});
