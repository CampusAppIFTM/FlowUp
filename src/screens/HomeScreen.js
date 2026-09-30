/**
 * src/screens/HomeScreen.js
 * ---------------------------------------------------------------------------
 * Tela exibida quando existe um usuário autenticado.
 * ---------------------------------------------------------------------------
 */
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import Svg, { Path, Circle } from "react-native-svg";

import { sair } from "../services/autenticacao";

const HomeScreen = ({ usuario }) => {
  const [saindo, setSaindo] = useState(false);

  const aoSair = async () => {
    setSaindo(true);
    try {
      await sair();
    } catch (e) {
      console.log("Falha ao sair:", e);
      setSaindo(false);
    }
  };

  // Pega apenas o primeiro nome do usuário para a saudação
  const primeiroNome = usuario?.displayName
    ? usuario.displayName.split(" ")[0]
    : "Usuário";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Barra Superior / Header */}
        <View style={styles.header}>
          {/* Botão do menu configurado para fazer logout caso acionado */}
          <TouchableOpacity onPress={aoSair} disabled={saindo}>
            <Feather name="menu" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <MaterialCommunityIcons
                name="lightning-bolt-outline"
                size={18}
                color="#00F2FE"
              />
            </View>
            <Text style={styles.logoText}>
              Flow<Text style={styles.logoHighlight}>Up</Text>
            </Text>
          </View>

          <TouchableOpacity style={styles.notificationButton}>
            <Feather name="bell" size={22} color="#FFFFFF" />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>

        {/* Saudação */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingTitle}>Olá, {primeiroNome}! 👋</Text>
          <Text style={styles.greetingSubtitle}>
            Vamos organizar seu semestre{"\n"}e evitar surpresas.
          </Text>
        </View>

        {/* Card: Próxima Atividade */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>Próxima atividade</Text>

          <View style={styles.tag}>
            <Text style={styles.tagText}>TRABALHO</Text>
          </View>

          <TouchableOpacity style={styles.activityRow}>
            <Text style={styles.activityTitle}>Trabalho de Redes</Text>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.dateRow}>
            <Feather name="calendar" size={16} color="#9CA3AF" />
            <Text style={styles.dateText}>Entrega: 05/06/2026 • 23:59</Text>
          </View>
        </View>

        {/* Seção: Resumo da Semana */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Resumo da semana</Text>

          <View style={styles.summaryGrid}>
            <View style={[styles.summaryCard, { backgroundColor: "#132238" }]}>
              <Feather name="file-text" size={20} color="#3B82F6" />
              <Text style={styles.summaryNumber}>4</Text>
              <Text style={styles.summaryLabel}>Provas</Text>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: "#211B38" }]}>
              <Feather name="file-text" size={20} color="#A855F7" />
              <Text style={styles.summaryNumber}>7</Text>
              <Text style={styles.summaryLabel}>Trabalhos</Text>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: "#112932" }]}>
              <Feather name="file-text" size={20} color="#14B8A6" />
              <Text style={styles.summaryNumber}>2</Text>
              <Text style={styles.summaryLabel}>Pendências</Text>
            </View>
          </View>
        </View>

        {/* Card: Índice de Sobrecarga */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Índice de Sobrecarga</Text>

          <View style={styles.overloadContainer}>
            <View style={styles.gaugeWrapper}>
              <Svg width="110" height="60" viewBox="0 0 100 55">
                {/* Arco de fundo */}
                <Path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#2D3748"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                {/* Arco colorido (indicador) */}
                <Path
                  d="M 10 50 A 40 40 0 0 1 65 18"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                {/* Ponteiro */}
                <Path
                  d="M 50 50 L 72 28"
                  stroke="#94A3B8"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <Circle cx="50" cy="50" r="6" fill="#94A3B8" />
              </Svg>
            </View>

            <View style={styles.overloadInfo}>
              <Text style={styles.overloadStatus}>Moderado</Text>
              <Text style={styles.overloadDescription}>
                Atenção: 2 dias com muitas atividades.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0B0E14",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#1E1B4B",
    borderWidth: 1,
    borderColor: "#00F2FE",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  logoHighlight: {
    color: "#A855F7",
  },
  notificationButton: {
    position: "relative",
    padding: 4,
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#C084FC",
  },
  greetingContainer: {
    marginVertical: 16,
  },
  greetingTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  greetingSubtitle: {
    fontSize: 15,
    color: "#9CA3AF",
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#131822",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
    marginBottom: 12,
  },
  tag: {
    backgroundColor: "#7C3AED",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  tagText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  activityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateText: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    justifyContent: "space-between",
    minHeight: 110,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  overloadContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 4,
  },
  gaugeWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  overloadInfo: {
    flex: 1,
  },
  overloadStatus: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F59E0B",
    marginBottom: 4,
  },
  overloadDescription: {
    fontSize: 13,
    color: "#9CA3AF",
    lineHeight: 18,
  },
});