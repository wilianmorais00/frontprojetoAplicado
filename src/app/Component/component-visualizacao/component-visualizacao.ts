import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsService, FormTemplate } from '../../Service/forms-service/forms-service';

type AggregatedRow = {
  questionId: string;
  prompt: string;
  type: FormTemplate['questions'][number]['type'];
  total: number;
  counts?: Record<string, number>;
  average?: number;
  samples?: string[];
};

@Component({
  selector: 'app-component-visualizacao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './component-visualizacao.html',
  styleUrls: ['./component-visualizacao.css'],
})
export class ComponentVisualizacao {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formsSvc = inject(FormsService);

  form?: FormTemplate | null;
  rows: AggregatedRow[] = [];

  ngOnInit(): void {
    // Aceita ?id=..., ?templateId=..., ou /:id
    const qp = this.route.snapshot.queryParamMap;
    const pm = this.route.snapshot.paramMap;
    const id =
      qp.get('id') ||
      qp.get('templateId') ||
      pm.get('id') ||
      '';

    const found = this.formsSvc.list().find(f => f.id === id) ?? null;
    this.form = found;

    // Monta linhas quando achar o template
    if (this.form && Array.isArray(this.form.questions)) {
      this.rows = this.form.questions.map(q => ({
        questionId: q.id,
        prompt: q.prompt,
        type: q.type,
        total: 0,
        counts: {},
        average: undefined,
        samples: [],
      }));
    } else {
      this.rows = [];
    }
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  formatDate(iso?: string): string {
    if (!iso) return '';
    const d = new Date(iso);
    return isNaN(d.getTime()) ? '' : d.toLocaleString();
  }
}
