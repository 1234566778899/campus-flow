export interface Tarea {
  idTarea?: number;
  titulo: string;
  descripcion: string;
  fechaLimite: Date; 
  prioridad: string;
  id_estudiante: number; 
  id_horario: number; 
  estado: boolean;
}