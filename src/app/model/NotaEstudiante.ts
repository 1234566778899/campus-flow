import { Asignatura } from "./asignatura";
import { Estudiante } from "./estudiante";
import { Nota } from "./nota";

export interface NotaEstudiante {
    estudiante: Estudiante;
    asignatura: Asignatura;
    notas: Nota[];
    promedioFinal: number;
    estado: 'aprobado' | 'desaprobado' | 'en_progreso';
    notasPendientes: number;
    notasRegistradas: number;
}