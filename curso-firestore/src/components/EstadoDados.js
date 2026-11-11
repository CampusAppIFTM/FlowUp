import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

export default function EstadoDados({ carregando, erro, recarregar }) {
  if (carregando) {
    return (
      <View style={estilos.container}>
        <ActivityIndicator size="large" color="#A878FF" />
        <Text style={estilos.texto}>Carregando atividades...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={estilos.container}>
        <Text style={estilos.erro}>{erro}</Text>
        <Pressable style={estilos.botao} onPress={recarregar}>
          <Text style={estilos.textoBotao}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  return null;
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#08111F",
    padding: 24,
    gap: 12,
  },
  texto: { color: "#D6E3FF", fontSize: 15 },
  erro: { color: "#FFB4B4", fontSize: 14, textAlign: "center" },
  botao: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12, backgroundColor: "#392D61" },
  textoBotao: { color: "#FFFFFF", fontWeight: "700" },
});
