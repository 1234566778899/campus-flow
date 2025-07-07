export interface Asignatura {
  idAsignatura: number;
  nombre: string;
  codigo?: string;
  ciclo?: number;
  creditos?: number;
  estudiantesMatriculados?: number;
  // otras propiedades según tu modelo
}