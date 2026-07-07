import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileUpload } from 'primeng/fileupload';
import { FileValidationService } from '../../services/file-validation.service';
import { ACCEPT_FILE_TYPES, MAX_FILE_SIZE, PostForm, PostFormSubmit } from './post-form';

describe('PostForm', () => {
  let component: PostForm;
  let fixture: ComponentFixture<PostForm>;
  let emitted: PostFormSubmit | undefined;
  let fileValidation: jasmine.SpyObj<Pick<FileValidationService, 'validateFile'>>;
  let mediaUploadClear: jasmine.Spy;

  const validFileType = ACCEPT_FILE_TYPES[0];
  const validFile = new File(
    ['content'],
    `test.${validFileType.split('/').pop()}`,
    { type: validFileType },
  );

  function setupMediaUpload(): void {
    mediaUploadClear = jasmine.createSpy('clear');
    component.mediaUpload = { clear: mediaUploadClear } as unknown as FileUpload;
  }

  beforeEach(async () => {
    fileValidation = jasmine.createSpyObj('FileValidationService', ['validateFile']);
    fileValidation.validateFile.and.returnValue(true);

    TestBed.overrideComponent(PostForm, {
      set: {
        template: '',
      },
    });

    await TestBed.configureTestingModule({
      imports: [PostForm],
      providers: [
        { provide: FileValidationService, useValue: fileValidation },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostForm);
    component = fixture.componentInstance;
    emitted = undefined;
    component.submitForm.subscribe((value) => {
      emitted = value;
    });
    fixture.detectChanges();
    setupMediaUpload();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputId', () => {
    it('should return post-content when parentDocumentId is not set', () => {
      expect(component.inputId).toBe('post-content');
    });

    it('should return comment-content when parentDocumentId is set', () => {
      fixture.componentRef.setInput('parentDocumentId', 'parent-123');
      fixture.detectChanges();

      expect(component.inputId).toBe('comment-content');
    });
  });

  describe('onSubmit', () => {
    it('should not emit when content is empty', () => {
      component.form.get('content')?.setValue('');

      component.onSubmit();

      expect(emitted).toBeUndefined();
    });

    it('should not emit when content is only whitespace', () => {
      component.form.get('content')?.setValue('   ');

      component.onSubmit();

      expect(emitted).toBeUndefined();
    });

    it('should emit trimmed content for a post', () => {
      component.form.get('content')?.setValue('  Post content  ');

      component.onSubmit();

      expect(emitted).toEqual({
        content: 'Post content',
        parentDocumentId: undefined,
        media: undefined,
      });
    });

    it('should emit parentDocumentId when set', () => {
      fixture.componentRef.setInput('parentDocumentId', 'parent-123');
      fixture.detectChanges();
      component.form.get('content')?.setValue('A comment');

      component.onSubmit();

      expect(emitted).toEqual({
        content: 'A comment',
        parentDocumentId: 'parent-123',
        media: undefined,
      });
    });

    it('should emit selected media when set', () => {
      const media = validFile;
      component.selectedMedia.set(media);
      component.form.get('content')?.setValue('Post with image');

      component.onSubmit();

      expect(emitted).toEqual({
        content: 'Post with image',
        parentDocumentId: undefined,
        media,
      });
    });
  });

  describe('onMediaSelect', () => {
    it('should do nothing when no file is provided', () => {
      component.onMediaSelect({ files: [] });

      expect(fileValidation.validateFile).not.toHaveBeenCalled();
      expect(component.selectedMedia()).toBeNull();
    });

    it('should clear upload and not set media when validation fails', () => {
      fileValidation.validateFile.and.returnValue(false);

      component.onMediaSelect({ files: [validFile] });

      expect(fileValidation.validateFile).toHaveBeenCalledWith(validFile, {
        maxFileSize: MAX_FILE_SIZE,
        acceptFileTypes: ACCEPT_FILE_TYPES,
      });
      expect(mediaUploadClear).toHaveBeenCalled();
      expect(component.selectedMedia()).toBeNull();
    });

    it('should set selected media and preview url when validation passes', () => {
      const createObjectURLSpy = spyOn(URL, 'createObjectURL').and.returnValue(
        'blob:test',
      );

      component.onMediaSelect({ files: [validFile] });

      expect(createObjectURLSpy).toHaveBeenCalledWith(validFile);
      expect(component.selectedMedia()).toBe(validFile);
      expect(component.previewUrl()).toBe('blob:test');
    });

    it('should revoke previous preview url when selecting a new file', () => {
      const revokeObjectURLSpy = spyOn(URL, 'revokeObjectURL');
      spyOn(URL, 'createObjectURL').and.returnValue('blob:second');
      component.previewUrl.set('blob:first');

      component.onMediaSelect({ files: [validFile] });

      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:first');
      expect(component.previewUrl()).toBe('blob:second');
    });
  });

  describe('clearMedia', () => {
    it('should revoke preview url, clear selected media and upload', () => {
      const revokeObjectURLSpy = spyOn(URL, 'revokeObjectURL');
      component.previewUrl.set('blob:test');
      component.selectedMedia.set(validFile);

      component.clearMedia();

      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:test');
      expect(component.previewUrl()).toBeNull();
      expect(component.selectedMedia()).toBeNull();
      expect(mediaUploadClear).toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('should reset form and clear media', () => {
      spyOn(URL, 'revokeObjectURL');
      component.previewUrl.set('blob:test');
      component.selectedMedia.set(validFile);
      component.form.get('content')?.setValue('Some content');

      component.reset();

      expect(component.form.get('content')?.value).toBeNull();
      expect(component.previewUrl()).toBeNull();
      expect(component.selectedMedia()).toBeNull();
      expect(mediaUploadClear).toHaveBeenCalled();
    });
  });
});
