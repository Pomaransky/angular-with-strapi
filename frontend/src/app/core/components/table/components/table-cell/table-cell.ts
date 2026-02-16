import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { TableColumnType } from '../../../../models';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-table-cell',
  imports: [TagModule, DatePipe, TranslateModule],
  templateUrl: './table-cell.html',
  styleUrl: './table-cell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCell {
  @Input({ required: true }) value!: string | Date | undefined | null;
  @Input({ required: true }) columnType!: TableColumnType;
  @Input({ required: true }) columnKey!: string;

  readonly TableColumnType = TableColumnType;

  get tagValue(): string {
    if (this.columnKey === 'confirmed')
      return this.value ? 'profile.confirmed' : 'profile.notConfirmed';
    if (this.columnKey === 'blocked')
      return this.value ? 'profile.blocked' : 'profile.active';
    return '';
  }

  get tagSeverity(): 'success' | 'danger' {
    if (this.columnKey === 'confirmed')
      return this.value ? 'success' : 'danger';
    if (this.columnKey === 'blocked') return this.value ? 'danger' : 'success';
    return 'success';
  }
}
