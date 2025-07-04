import { Nota } from "./nota";

export interface NotasAgrupadasDTO {
  nombreAsignatura: string;
  idAsignatura: number;
  notas: Nota[];
  promedio: number;
  Estado: boolean; 
}