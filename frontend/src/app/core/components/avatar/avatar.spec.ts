import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserRoleType } from '../../models/auth/user-role-type.enum';
import { User } from '../../models';

import { Avatar } from './avatar';

const createUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  documentId: 'user-1',
  username: 'johndoe',
  email: 'john@example.com',
  provider: 'local',
  confirmed: true,
  blocked: false,
  role: {
    id: 1,
    name: 'Authenticated',
    description: 'Authenticated user',
    type: UserRoleType.AUTHENTICATED,
  },
  ...overrides,
});

describe('Avatar', () => {
  let component: Avatar;
  let fixture: ComponentFixture<Avatar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Avatar],
    }).compileComponents();

    fixture = TestBed.createComponent(Avatar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('defaultData', () => {
    it('returns empty string when userData is null', () => {
      component.userData = null;

      expect(component.defaultData).toBe('');
    });

    it('returns first letters of firstName and lastName when both are provided', () => {
      component.userData = createUser({
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(component.defaultData).toBe('JD');
    });

    it('returns username initial when firstName is missing', () => {
      component.userData = createUser({
        lastName: 'Doe',
      });

      expect(component.defaultData).toBe('j');
    });

    it('returns username initial when lastName is missing', () => {
      component.userData = createUser({
        firstName: 'John',
      });

      expect(component.defaultData).toBe('j');
    });

    it('returns username initial when both firstName and lastName are missing', () => {
      component.userData = createUser();

      expect(component.defaultData).toBe('j');
    });
  });

  describe('boxSize and fontSize', () => {
    const sizeCases = [
      { size: 'sm' as const, boxSize: '2rem', fontSize: '0.75rem' },
      { size: 'md' as const, boxSize: '3rem', fontSize: '1.25rem' },
      { size: 'lg' as const, boxSize: '4rem', fontSize: '1.5rem' },
    ];

    sizeCases.forEach(({ size, boxSize, fontSize }) => {
      it(`returns boxSize ${boxSize} and fontSize ${fontSize} for size "${size}"`, () => {
        component.size = size;

        expect(component.boxSize).toBe(boxSize);
        expect(component.fontSize).toBe(fontSize);
      });
    });
  });
});
