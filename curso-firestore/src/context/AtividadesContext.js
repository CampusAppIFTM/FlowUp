import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { buscarAtividades, criarAtividade as salvarAtividade } from "../services/firestoreService";
import { normalizarAtividade } from "../utils/atividades";

const AtividadesContext = createContext(null);

export function AtividadesProvider({ children }) {
  const [atividades, setAtividades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const recarregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);

    try {
      const dados = await buscarAtividades();
      setAtividades(dados.map(normalizarAtividade));
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível carregar as atividades.");
    } finally {
      setCarregando(false);
    }
  }, []);

  const cadastrarAtividade = useCallback(async (dados) => {
    const atividadeSalva = await salvarAtividade(dados);
    const atividadeNormalizada = normalizarAtividade(atividadeSalva);

    setAtividades((atuais) => [...atuais, atividadeNormalizada]);

    return atividadeNormalizada;
  }, []);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  const valor = useMemo(
    () => ({ atividades, carregando, erro, recarregar, cadastrarAtividade }),
    [atividades, carregando, erro, recarregar, cadastrarAtividade],
  );

  return <AtividadesContext.Provider value={valor}>{children}</AtividadesContext.Provider>;
}

export function useAtividades() {
  const contexto = useContext(AtividadesContext);

  if (!contexto) {
    throw new Error("useAtividades deve ser usado dentro de AtividadesProvider.");
  }

  return contexto;
}
