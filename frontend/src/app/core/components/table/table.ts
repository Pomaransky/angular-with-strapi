import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TableColumn, RowActionItem } from '../../models';
import { TableCell } from './components/table-cell/table-cell';

@Component({
  selector: 'app-table',
  imports: [TableModule, ButtonModule, Menu, TableCell],
  templateUrl: './table.html',
  styleUrl: './table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Table implements OnChanges {
  @Input({ required: true }) data!: any[];
  @Input({ required: true }) columns!: TableColumn[];
  @Input({ required: true }) pageSize!: number;
  @Input({ required: true }) totalRecords!: number;
  @Input({ required: true }) isLoading!: boolean;
  @Output() onLazyLoad = new EventEmitter<TableLazyLoadEvent>();

  @Input() rowActions?: (row: any) => RowActionItem[];
  @Input() onRowAction?: (row: any, actionId: string) => void;
  private rowActionsMenuItemsCache = new Map<any, { rowRef: any; items: MenuItem[] }>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) this.rowActionsMenuItemsCache.clear();
  }

  getRowActions(row: any): MenuItem[] {
    if (!this.rowActions || !this.onRowAction) return [];

    const key = row?.id ?? row?.documentId ?? row;
    const cached = this.rowActionsMenuItemsCache.get(key);
    if (cached && cached.rowRef === row) return cached.items;

    const actions = this.rowActions(row);
    const items = actions.map((item) => ({
      label: item.label,
      icon: item.icon,
      disabled: item.disabled,
      command: () => this.onRowAction!(row, item.actionId),
    }));
    this.rowActionsMenuItemsCache.set(key, { rowRef: row, items });
    return items;
  }
}
