export interface Publicacion {
  idPublicacion: number;
  contenido: string;
  fecha: Date;
  label: string;
  estado: boolean;
  idGrupoForo: number; // Según el DTO del backend
}