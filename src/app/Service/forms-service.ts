import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Tipos de pergunta suportados no formulário
export type QuestionType = 'sticker' | 'slider' | 'text' | 'stars';

// Modelo de pergunta de formulário
export interface FormQuestion {
  id: string;
  prompt: string;
  type: QuestionType;
  order: number;
  required?: boolean;
}

// Modelo de template de formulário salvo
export interface FormTemplate {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  questions: FormQuestion[];
  totalAnswers: number;
  lastAnswerAt: string;
}

const LS_KEY = 'questio.templates';

@Injectable({ providedIn: 'root' })
export class FormsService {
  private _templates$ = new BehaviorSubject<FormTemplate[]>(this.load());
  templates$ = this._templates$.asObservable();

  // Lista todos os templates
  list(): FormTemplate[] {
    return this._templates$.value;
  }

  // Busca um template pelo ID
  getById(id: string): FormTemplate | null {
    return this._templates$.value.find(t => t.id === id) ?? null;
  }

  // Adiciona um novo template
  addTemplate(input: { title: string; description?: string; questions: FormQuestion[] }): FormTemplate {
    const t: FormTemplate = {
      id: this.uuid(),
      title: input.title.trim(),
      description: input.description?.trim() ?? '',
      createdAt: new Date().toISOString(),
      questions: input.questions ?? [],
      totalAnswers: 0,
      lastAnswerAt: new Date().toISOString(),
    };
    const next = [t, ...this._templates$.value];
    this._templates$.next(next);
    this.persist(next);
    return t;
  }

  // Atualiza parcialmente um template
  update(id: string, patch: Partial<FormTemplate>) {
    const next = this._templates$.value.map(t => (t.id === id ? { ...t, ...patch } : t));
    this._templates$.next(next);
    this.persist(next);
  }

  // Insere ou atualiza um template inteiro
  upsert(tmpl: FormTemplate) {
    const exists = this._templates$.value.some(t => t.id === tmpl.id);
    const next = exists
      ? this._templates$.value.map(t => (t.id === tmpl.id ? { ...t, ...tmpl } : t))
      : [tmpl, ...this._templates$.value];
    this._templates$.next(next);
    this.persist(next);
  }

  // Remove um template
  deleteTemplate(id: string): void {
    const next = this._templates$.value.filter(t => t.id !== id);
    this._templates$.next(next);
    this.persist(next);
  }

  private load(): FormTemplate[] {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? (JSON.parse(raw) as FormTemplate[]) : [];
    } catch {
      return [];
    }
  }

  private persist(list: FormTemplate[]) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(list));
    } catch {
      // silencioso
    }
  }

  private uuid(): string {
    try {
      return crypto.randomUUID();
    } catch {
      return Math.random().toString(36).slice(2);
    }
  }
}
