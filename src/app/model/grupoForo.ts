export interface GrupoForo{
  idGrupoForo?: number;
  Titulo: string;
  Descripcion: string;
  Campo: string;
  FechaCreacion: Date; // O string si tu backend lo envía como ISO string
  id_Asigneatura?: number; // ID de la asignatura relacionada
  nombreAsignatura?: string; 
  Estado: boolean;
}
