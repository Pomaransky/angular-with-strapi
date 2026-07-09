import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ModalType } from '../constants';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private router = inject(Router);

  readonly queryParam = 'modal';
  readonly activeModal = signal<ModalType | null>(null);

  open(modal: ModalType): void {
    this.activeModal.set(modal);
    this.updateQueryParam(modal);
  }

  close(): void {
    this.activeModal.set(null);
    this.updateQueryParam(null);
  }

  isOpen(modal: ModalType): boolean {
    return this.activeModal() === modal;
  }

  onDialogVisibleChange(modal: ModalType, visible: boolean): void {
    if (visible) {
      this.open(modal);
      return;
    }

    if (this.activeModal() === modal) {
      this.close();
    }
  }

  syncFromRoute(modalParam: string | null): void {
    this.activeModal.set(this.parseModal(modalParam));
  }

  private parseModal(modalParam: string | null): ModalType | null {
    if (!modalParam) {
      return null;
    }

    return Object.values(ModalType).includes(modalParam as ModalType)
      ? (modalParam as ModalType)
      : null;
  }

  private updateQueryParam(modal: ModalType | null): void {
    this.router.navigate([], {
      queryParams: {
        [this.queryParam]: modal,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
