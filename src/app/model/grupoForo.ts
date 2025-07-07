export interface GrupoForo {
  idGrupoForo: number;
  titulo: string;
  descripcion: string;
  campo?: string;
  fechaCreacion: Date;
  id_Asigneatura?: number; // Según el DTO del backend
  nombreAsignatura?: string; // Para mostrar el nombre de la asignatura
  estado: boolean;
}