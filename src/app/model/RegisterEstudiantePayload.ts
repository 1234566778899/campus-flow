export interface RegisterEstudiantePayload {
  nombre: string;
  apellido: string;
  email: string;
  username: string;
  password: string;
  ciclo: number;
  idCarrera: number;
}