export interface FormAnswer {
  id: string;            // ID único da resposta (se você usar)
  formId: string;        // ID do formulário (FormTemplate.id)
  questionId: string;    // ID da pergunta (FormQuestion.id)
  value: string | number | boolean | null;
  answeredAt: string;    // Data/hora da resposta (ISO)
}
