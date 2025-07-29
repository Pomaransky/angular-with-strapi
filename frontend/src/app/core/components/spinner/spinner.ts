import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-spinner',
  imports: [ProgressSpinnerModule],
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Spinner {
  @Input() loadingText: string = 'Loading...';
}
