export interface Nota {
  idNota?: number; 
  Tipo: string;
  Puntaje: number;
  Peso_Nota: number;
  id_asignatura: number;
  nombreAsignatura: string; 
  id_estudiante: number; 
  Estado: boolean;
}