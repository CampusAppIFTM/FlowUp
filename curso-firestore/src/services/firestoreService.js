import { addDoc, collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function buscarAtividades() {
  const referencia = collection(db, "dados");
  const documentos = await getDocs(referencia);

  return documentos.docs.map((documento) => ({
    id: documento.id,
    ...documento.data(),
  }));
}

export async function criarAtividade({ descricao, disciplina, professor, data }) {
  const campos = { descricao, disciplina, professor };

  for (const [campo, valor] of Object.entries(campos)) {
    if (typeof valor !== "string" || !valor.trim()) {
      throw new Error(`O campo "${campo}" é obrigatório.`);
    }
  }

  if (!(data instanceof Date) || Number.isNaN(data.getTime())) {
    throw new Error("Informe uma data e horário válidos.");
  }

  const atividade = {
    descricao: descricao.trim(),
    disciplina: disciplina.trim(),
    professor: professor.trim(),
    data: Timestamp.fromDate(data),
  };
  const documento = await addDoc(collection(db, "dados"), atividade);

  return {
    id: documento.id,
    ...atividade,
  };
}
