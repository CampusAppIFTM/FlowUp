import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
 

export async function buscarAtividades() {
  const referencia = collection(db, 'dados');
  const documentos = await getDocs(referencia);
 
  if (documentos.empty) {
    throw new Error(
      `Documento "${cursoId}" não encontrado na coleção cursos.`
    );
  }
  const itens = documentos.docs.map((documento) => ({
    id: documento.id,
    ...documento.data(),
  }))
  
  return itens ;
}
