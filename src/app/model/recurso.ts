export interface Recurso {
  idRecurso?: number;
  tipoArchivo: string;
  url: string;
  fechaSubida: string; // Usar string para Date de Java (formato ISO 8601)
  id_tarea?: number; // Opcional, si el recurso está asociado a una tarea
  id_publicacion?: number; // Opcional, si el recurso está asociado a una publicación
  Estado: boolean;
}
