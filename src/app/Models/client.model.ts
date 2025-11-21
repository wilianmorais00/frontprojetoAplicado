export interface Client {
  id: string;   // ID único do hóspede
  name: string;
  email: string;
  phone: string;
  room: string;  // Número/quarto
  checkin: string;  // Data/hora de check-in (ISO)
  checkout: string;  // Data/hora de check-out (ISO)
  assignedFormId?: string | null; // ID do formulário atribuído (FormTemplate.id)
}
