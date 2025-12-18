export interface Expense {
    id: string;
    concepto: string;
    categoria: 'comida' | 'transporte' | 'salud' | 'ocio';
    monto: number;
    fecha: string;
    pagado: boolean;
}
