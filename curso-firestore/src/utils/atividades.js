export function converterData(data) {
  if (!data) {
    return null;
  }

  let dataConvertida;

  if (typeof data.toDate === "function") {
    dataConvertida = data.toDate();
  } else if (data instanceof Date) {
    dataConvertida = data;
  } else if (typeof data.seconds === "number") {
    dataConvertida = new Date(data.seconds * 1000);
  } else {
    dataConvertida = new Date(data);
  }

  return Number.isNaN(dataConvertida.getTime()) ? null : dataConvertida;
}

export function normalizarAtividade(atividade) {
  return {
    id: String(atividade.id),
    descricao: atividade.descricao || "Atividade sem descrição",
    disciplina: atividade.disciplina || "Sem disciplina",
    professor: atividade.professor || "Professor não informado",
    data: converterData(atividade.data),
  };
}

export function formatarDataHora(data) {
  if (!data) {
    return "Data não informada";
  }

  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ordenarPorData(atividades) {
  return [...atividades].sort((a, b) => {
    if (!a.data) return 1;
    if (!b.data) return -1;
    return a.data.getTime() - b.data.getTime();
  });
}
