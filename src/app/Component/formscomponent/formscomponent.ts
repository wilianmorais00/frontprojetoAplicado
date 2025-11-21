import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { FormsService } from '../../Service/forms-service';

type QuestionType = 'sticker' | 'slider' | 'text' | 'stars';

// FormGroup tipado de uma pergunta do formulário
type QuestionFormGroup = FormGroup<{
  id: FormControl<string>; // ID único da pergunta
  prompt: FormControl<string>;
  type: FormControl<QuestionType>;
  required: FormControl<boolean>; // Indica se a resposta é obrigatória
}>;

/**
 * Construtor de formulários (templates).
 * Permite criar perguntas, definir tipo, ordem e obrigatoriedade.
 */
@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './formscomponent.html',
  styleUrls: ['./formscomponent.css'],
})
export class ConstrutorFormularioComponent {
  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);

  // ✅ AQUI estava o erro: serviço correto é FormsService
  private formsService: FormsService = inject(FormsService);

  // Formulário principal do template (título, descrição e lista de perguntas)
  form = this.fb.group({
    title: this.fb.control('', { validators: [Validators.required, Validators.minLength(3)] }),
    description: [''],
    questions: this.fb.array<QuestionFormGroup>([]),
  });

  flashMsg: string | null = null;
  flashKind: 'success' | 'info' | 'danger' = 'success';
  private flashTimer: any;

  private showFlash(msg: string, kind: 'success' | 'info' | 'danger' = 'success') {
    this.flashMsg = msg;
    this.flashKind = kind;
    if (this.flashTimer) clearTimeout(this.flashTimer);
    this.flashTimer = setTimeout(() => (this.flashMsg = null), 3500);
  }

  // Acesso tipado ao FormArray de perguntas
  get questions(): FormArray<QuestionFormGroup> {
    return this.form.get('questions') as FormArray<QuestionFormGroup>;
  }

  ngOnInit() {
    // Garante pelo menos 1 pergunta quando a tela abre
    if (this.questions.length === 0) this.addQuestion();
  }

  // Cria um novo grupo de pergunta com ID único
  private newQuestionGroup(): QuestionFormGroup {
    return this.fb.group({
      id: this.fb.control(this.uuid()),
      prompt: this.fb.control('', { validators: [Validators.required, Validators.minLength(3)] }),
      type: this.fb.control<QuestionType>('sticker'),
      required: this.fb.control(false),
    });
  }

  addQuestion() {
    this.questions.push(this.newQuestionGroup());
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  // Reordena perguntas via drag-and-drop
  drop(event: CdkDragDrop<QuestionFormGroup[]>) {
    if (event.previousIndex === event.currentIndex) return;
    moveItemInArray(this.questions.controls, event.previousIndex, event.currentIndex);
    this.questions.updateValueAndValidity();
  }

  setType(index: number, type: string) {
    this.questions.at(index).controls.type.setValue(type as QuestionType);
  }

  // TrackBy usando o ID de cada pergunta
  trackById = (_: number, group: QuestionFormGroup) => group.controls.id.value;

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      title: this.form.controls.title.value,
      description: this.form.controls.description.value,
      questions: this.questions.controls.map((q, order) => ({
        id: q.controls.id.value, // ID da pergunta
        prompt: q.controls.prompt.value,
        type: q.controls.type.value,
        order,
        required: q.controls.required.value,
      })),
    };

    // Cria o template de formulário (FormTemplate) com ID próprio
    const created = this.formsService.addTemplate(payload);
    this.showFlash(
      `Formulário ${created.title} criado e disponível para atribuir a hóspedes.`,
      'success'
    );
  }

  cancel() {
    this.router.navigate(['/home']);
  }

  // Geração de ID único (fallback para Math.random caso crypto não esteja disponível)
  private uuid(): string {
    try {
      return crypto.randomUUID();
    } catch {
      return Math.random().toString(36).slice(2);
    }
  }
}
