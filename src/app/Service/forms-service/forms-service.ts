import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type QuestionType = 'sticker' | 'slider' | 'text' | 'stars';

export interface FormQuestion {
  id: string;
  prompt: string;
  type: QuestionType;
  order: number;
}

export interface FormTemplate {
  id: string;
  title: string;
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

  addTemplate(input: { title: string; questions: FormQuestion[] }): FormTemplate {
    const t: FormTemplate = {
      id: this.uuid(),
      title: input.title.trim(),
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

  deleteTemplate(id: string): void {
    const next = this._templates$.value.filter(t => t.id !== id);
    this._templates$.next(next);
    this.persist(next);
  }

  list(): FormTemplate[] {
    return this._templates$.value;
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
    } catch {}
  }

  private uuid(): string {
    try {
      return crypto.randomUUID();
    } catch {
      return Math.random().toString(36).slice(2);
    }
  }
}
