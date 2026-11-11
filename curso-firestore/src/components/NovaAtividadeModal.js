import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAtividades } from "../context/AtividadesContext";

const camposIniciais = {
  descricao: "",
  disciplina: "",
  professor: "",
  data: "",
};

function converterDataFormulario(valor) {
  const correspondencia = valor.match(
    /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(\d{4}) ([01]\d|2[0-3]):([0-5]\d)$/,
  );

  if (!correspondencia) {
    return null;
  }

  const [, dia, mes, ano, hora, minuto] = correspondencia;
  const data = new Date(Number(ano), Number(mes) - 1, Number(dia), Number(hora), Number(minuto));

  if (
    data.getFullYear() !== Number(ano) ||
    data.getMonth() !== Number(mes) - 1 ||
    data.getDate() !== Number(dia)
  ) {
    return null;
  }

  return data;
}

export default function NovaAtividadeModal({ visible, onClose }) {
  const { cadastrarAtividade } = useAtividades();
  const [campos, setCampos] = useState(camposIniciais);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  function fechar() {
    if (salvando) {
      return;
    }

    setCampos(camposIniciais);
    setErro("");
    onClose();
  }

  async function salvar() {
    const data = converterDataFormulario(campos.data.trim());

    if (!campos.descricao.trim() || !campos.disciplina.trim() || !campos.professor.trim()) {
      setErro("Preencha a descrição, disciplina e professor.");
      return;
    }

    if (!data) {
      setErro("Informe uma data válida no formato DD/MM/AAAA HH:mm.");
      return;
    }

    setSalvando(true);
    setErro("");

    try {
      await cadastrarAtividade({
        descricao: campos.descricao,
        disciplina: campos.disciplina,
        professor: campos.professor,
        data,
      });
      setCampos(camposIniciais);
      onClose();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível salvar a atividade.");
    } finally {
      setSalvando(false);
    }
  }

  function atualizarCampo(campo, valor) {
    setCampos((atuais) => ({ ...atuais, [campo]: valor }));
    setErro("");
  }

  useEffect(() => {
    if (!visible || Platform.OS !== "android") {
      return undefined;
    }

    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!salvando) {
        setCampos(camposIniciais);
        setErro("");
        onClose();
      }

      return true;
    });

    return () => subscription.remove();
  }, [visible, salvando, onClose]);

  if (!visible) {
    return null;
  }

  return (
    <View style={estilos.overlay} accessibilityViewIsModal>
      <Pressable style={estilos.fundoPressionavel} onPress={fechar} />
      <KeyboardAvoidingView
        style={estilos.ajusteTeclado}
        behavior="padding"
        keyboardVerticalOffset={0}
        pointerEvents="box-none"
      >
        <View style={estilos.painel}>
          <View style={estilos.cabecalho}>
            <View>
              <Text style={estilos.titulo}>Nova atividade</Text>
              <Text style={estilos.subtitulo}>Adicione um compromisso à sua agenda</Text>
            </View>
            <Pressable
              style={estilos.botaoFechar}
              onPress={fechar}
              disabled={salvando}
              accessibilityRole="button"
              accessibilityLabel="Fechar formulário"
            >
              <Ionicons name="close" size={22} color="#D8E2F8" />
            </Pressable>
          </View>

          <ScrollView
            style={estilos.scrollFormulario}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={estilos.formulario}
          >
            <Campo
              label="Descrição"
              valor={campos.descricao}
              onChangeText={(valor) => atualizarCampo("descricao", valor)}
              placeholder="Ex.: Entrega parcial 1"
            />
            <Campo
              label="Disciplina"
              valor={campos.disciplina}
              onChangeText={(valor) => atualizarCampo("disciplina", valor)}
              placeholder="Ex.: DDM"
            />
            <Campo
              label="Professor"
              valor={campos.professor}
              onChangeText={(valor) => atualizarCampo("professor", valor)}
              placeholder="Nome do professor"
            />
            <Campo
              label="Data e horário"
              valor={campos.data}
              onChangeText={(valor) => atualizarCampo("data", valor)}
              placeholder="DD/MM/AAAA HH:mm"
              hint="Ex.: 10/11/2026 14:30"
            />

            {erro ? <Text style={estilos.erro}>{erro}</Text> : null}

            <Pressable
              style={[estilos.botaoSalvar, salvando && estilos.botaoDesabilitado]}
              onPress={salvar}
              disabled={salvando}
            >
              {salvando ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={19} color="#FFFFFF" />
                  <Text style={estilos.textoBotaoSalvar}>Salvar atividade</Text>
                </>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function Campo({ label, valor, onChangeText, placeholder, hint, keyboardType }) {
  return (
    <View style={estilos.grupoCampo}>
      <Text style={estilos.label}>{label}</Text>
      <TextInput
        style={estilos.input}
        value={valor}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#71809A"
        keyboardType={keyboardType || "default"}
        autoCapitalize="sentences"
        returnKeyType="next"
      />
      {hint ? <Text style={estilos.dica}>{hint}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(2, 8, 18, 0.72)",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 20,
    elevation: 20,
  },
  ajusteTeclado: {
    flex: 1,
    justifyContent: "flex-end",
  },
  fundoPressionavel: {
    ...StyleSheet.absoluteFillObject,
  },
  painel: {
    maxHeight: "90%",
    flexShrink: 1,
    backgroundColor: "#101C2D",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: Platform.OS === "ios" ? 30 : 22,
    borderWidth: 1,
    borderColor: "#26364D",
  },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },
  titulo: {
    color: "#F0F4FF",
    fontSize: 21,
    fontWeight: "700",
  },
  subtitulo: {
    color: "#9EABC2",
    fontSize: 13,
    marginTop: 5,
  },
  botaoFechar: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1C2A3D",
  },
  formulario: {
    paddingBottom: 8,
  },
  scrollFormulario: {
    flexShrink: 1,
  },
  grupoCampo: {
    marginBottom: 16,
  },
  label: {
    color: "#DCE5F6",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    minHeight: 48,
    color: "#F0F4FF",
    backgroundColor: "#0A1423",
    borderWidth: 1,
    borderColor: "#2A3A51",
    borderRadius: 13,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  dica: {
    color: "#8392AA",
    fontSize: 11,
    marginTop: 6,
  },
  erro: {
    color: "#FFB4B4",
    fontSize: 13,
    marginBottom: 14,
  },
  botaoSalvar: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
    borderRadius: 15,
    backgroundColor: "#7752D2",
  },
  botaoDesabilitado: {
    opacity: 0.7,
  },
  textoBotaoSalvar: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
