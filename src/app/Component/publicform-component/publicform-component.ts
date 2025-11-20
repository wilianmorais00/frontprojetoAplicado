import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-public-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './publicform-component.html',
  styleUrls: ['./publicform-component.css'],
})
export class PublicFormComponent {
  brand = 'QuestIO';

  hotel = new URLSearchParams(location.search).get('hotel') ?? 'HOTEL AB';

  private queryQ = (new URLSearchParams(location.search).get('q') ?? 'sticker,bar,stars,text')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  blocks: Array<
    { id: string; type: 'sticker'|'bar'|'stars'|'text'; title: string }
  > = this.queryQ.map((t, idx) => ({
    id: `q${idx+1}`,
    type: (['sticker','bar','stars','text'].includes(t) ? t : 'sticker') as any,
    title: 'COMO VOCÊ AVALIA SUA ESTADIA'
  }));

  answers: Record<string, any> = {};

  selectSticker(qid: string, v: 1|2|3|4|5) { this.answers[qid] = v; }
  selectStars(qid: string, v: number)      { this.answers[qid] = v; }
  onSlider(qid: string, ev: Event)         { this.answers[qid] = +(ev.target as HTMLInputElement).value; }
  onText(qid: string, v: string)           { this.answers[qid] = v; }

  confirm() {
    alert('Respostas (demo):\n' + JSON.stringify(this.answers, null, 2));
  }
}
