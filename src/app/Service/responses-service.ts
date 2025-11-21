import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Resposta de uma pergunta de formulário
export interface FormAnswer {
  questionId: string;       // ID da pergunta (FormQuestion.id)
  value: string | number;   // Valor respondido
  createdAt?: string;       // Data/hora da resposta (ISO)
}

@Injectable({ providedIn: 'root' })
export class RespostasFormularioService {
  // Map formId -> lista reativa de respostas
  private store = new Map<string, BehaviorSubject<FormAnswer[]>>();

  // Observa as respostas de um formulário específico (por ID)
  watchResponses(formId: string): Observable<FormAnswer[]> {
    if (!this.store.has(formId)) this.store.set(formId, new BehaviorSubject<FormAnswer[]>([]));
    return this.store.get(formId)!.asObservable();
  }

  // Adiciona uma resposta em memória (não persiste em localStorage)
  addResponse(formId: string, answer: FormAnswer) {
    if (!this.store.has(formId)) this.store.set(formId, new BehaviorSubject<FormAnswer[]>([]));
    const subj = this.store.get(formId)!;
    subj.next([...subj.value, { ...answer, createdAt: new Date().toISOString() }]);
  }
}
