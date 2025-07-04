export interface Usuario {
  idUsuario?: number;
  nombre: string;
  apellido: string;
  email: string;
  username: string;
  password?: string;
  rolId: number; 
  Estado: boolean;
}