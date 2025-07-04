export interface Horario {
  idHorario?: number;
  dia: Date; 
  horaInicio: Date; 
  horaFin: Date;
  Estado: boolean;
  idAsignatura: number;
}