export interface Publicacion {
  IdPublicacion?: number;
  Contenido: string;
  Fecha: string; // Usar string para LocalDate de Java (formato ISO 8601)
  label: string;
  Estado: boolean;
  idGrupoForo: number;
}