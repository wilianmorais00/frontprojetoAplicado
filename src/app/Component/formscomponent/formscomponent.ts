import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { FormsService } from '../../Service/forms-service/forms-service';

type QuestionType = 'sticker' | 'slider' | 'text' | 'stars';

type QuestionFormGroup = FormGroup<{
  id: FormControl<string>;
  prompt: FormControl<string>;
  type: FormControl<QuestionType>;
}>;

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './formscomponent.html',
  styleUrls: ['./formscomponent.css'],
})
export class FormsComponent {
  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private formsService = inject(FormsService);

  form = this.fb.group({
    title: this.fb.control('', { validators: [Validators.required, Validators.minLength(3)] }),
    questions: this.fb.array<QuestionFormGroup>([])
  });

  get questions(): FormArray<QuestionFormGroup> {
    return this.form.get('questions') as FormArray<QuestionFormGroup>;
  }

  ngOnInit() {
    if (this.questions.length === 0) this.addQuestion();
  }

  private newQuestionGroup(): QuestionFormGroup {
    return this.fb.group({
      id: this.fb.control(this.uuid()),
      prompt: this.fb.control('', { validators: [Validators.required, Validators.minLength(3)] }),
      type: this.fb.control<QuestionType>('sticker')
    });
  }

  addQuestion() {
    this.questions.push(this.newQuestionGroup());
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  drop(event: CdkDragDrop<QuestionFormGroup[]>) {
    if (event.previousIndex === event.currentIndex) return;
    moveItemInArray(this.questions.controls, event.previousIndex, event.currentIndex);
    this.questions.updateValueAndValidity();
  }

  setType(index: number, type: string) {
    this.questions.at(index).controls.type.setValue(type as QuestionType);
  }

  trackById = (_: number, group: QuestionFormGroup) => group.controls.id.value;

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      title: this.form.controls.title.value,
      questions: this.questions.controls.map((q, order) => ({
        id: q.controls.id.value,
        prompt: q.controls.prompt.value,
        type: q.controls.type.value,
        order
      }))
    };

    this.formsService.addTemplate(payload);
    alert('Formulário salvo e disponível para envio');
    this.router.navigate(['/home']);
  }

  cancel() {
    this.router.navigate(['/home']);
  }

  private uuid(): string {
    try { return crypto.randomUUID(); }
    catch { return Math.random().toString(36).slice(2); }
  }
}
