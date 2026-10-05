export class Cliente {
  id: number | null;
  nombres: string;
  apellidos: string;
  cedula: string;
  email: string;
  telefono: string;
  estado: boolean;
  fechaRegistro?: string;
}

export type cliente = Cliente;
