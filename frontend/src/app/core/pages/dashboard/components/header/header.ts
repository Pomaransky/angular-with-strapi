import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { menuItems } from '../../../../constants/menuItems.const';
import { MenuItem } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header implements OnInit {
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  currentRouteLabel = '';

  ngOnInit(): void {
    this.updateCurrentRouteLabel();
    this.router.events
      .pipe(
        tap(() => {
          this.updateCurrentRouteLabel();
          this.cdr.detectChanges();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private updateCurrentRouteLabel(): void {
    const currentUrl = this.router.url.split('?')[0];
    const currentMenuItem = menuItems.find((item: MenuItem) => {
      const link = item.routerLink;
      if (typeof link !== 'string') return link === currentUrl;
      if (link === currentUrl) return true;
      if (link.includes(':')) {
        const pattern = link.replace(/:[^/]+/g, '[^/]+');
        return new RegExp(`^${pattern}$`).test(currentUrl);
      }
      return false;
    });
    this.currentRouteLabel = currentMenuItem?.label ?? '';
  }
}
