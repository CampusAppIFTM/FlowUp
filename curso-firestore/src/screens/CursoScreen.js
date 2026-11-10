import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, FlatList, StyleSheet, Text, View } from "react-native";
import { buscarAtividades } from "../services/cursoService";

const CursoScreen = () => {
    const [atividades, setAtividades] = useState(null); // sucesso
    const [carregando, setCarregando] = useState(true); // começa carregando
    const [erro, setErro] = useState(null); // erro
    
    async function carregar() {
        setCarregando(true);
        setErro(null);
        try {
            const dados = await buscarAtividades();
            setAtividades(dados);
        } catch (e) {
            setErro(e.message);
        } finally {
            // roda no sucesso E no erro
            setCarregando(false);
        }
    }
    
    useEffect(() => {
        carregar();
    }, []); // [] = uma única vez, quando a tela abre
    
    if (carregando) {
        return (
            <View style={estilos.centro}>
                <ActivityIndicator size="large" />
                <Text>Carregando...</Text>
            </View>
        );
    }

    if (erro) {
        return (
            <View style={estilos.centro}>
                <Text style={estilos.textoErro}>{erro}</Text>
                <Pressable style={estilos.botao} onPress={carregar}>
                    <Text style={estilos.textoBotao}>Tentar novamente</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={{flex:1, margin:8, marginTop:30}}>
            <FlatList 
            data={atividades}
            renderItem={({item})=><Text>{disciplina}</Text>}
            />
        </View>
    );
};
export default CursoScreen;


