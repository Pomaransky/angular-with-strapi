import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-data-row',
  imports: [],
  templateUrl: './data-row.html',
  styleUrl: './data-row.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataRow {
  @Input({ required: true }) label: string = '';
  @Input({ required: true }) value: string = '';
  @Input() icon: string = '';
  @Input() valueClass: string = '';
}
