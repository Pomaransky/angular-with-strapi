import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from './toast-service';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

@Injectable({
  providedIn: 'root',
})
export class FileValidationService {
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);

  validateFile(
    file: File,
    options: {
      maxFileSize: number;
      acceptFileTypes: string[];
    },
  ): boolean {
    if (file.size > options.maxFileSize) {
      this.toastService.errorToast(
        this.translate.instant('upload.maxFileSizeExceeded', {
          maxSize: formatFileSize(options.maxFileSize),
        }),
      );
      return false;
    }
    if (!options.acceptFileTypes.includes(file.type)) {
      const fileTypesLabel = options.acceptFileTypes
        .map((t) => t.split('/').pop()?.toUpperCase() ?? t)
        .join(', ');
      this.toastService.errorToast(
        this.translate.instant('upload.invalidFileType', {
          fileTypes: fileTypesLabel,
        }),
      );
      return false;
    }
    return true;
  }
}
