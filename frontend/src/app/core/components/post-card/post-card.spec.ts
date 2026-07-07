import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Post } from '../../models';
import { UserRoleType } from '../../models/auth/user-role-type.enum';
import { PostsStore } from '../../store/posts.store';
import { PostCard } from './post-card';

describe('PostCard', () => {
  let component: PostCard;
  let fixture: ComponentFixture<PostCard>;
  let router: jasmine.SpyObj<Pick<Router, 'navigate'>>;
  let postsStore: jasmine.SpyObj<
    Pick<InstanceType<typeof PostsStore>, 'setCurrentPost'>
  >;

  const mockPost: Post = {
    id: 1,
    documentId: 'doc-123',
    title: 'Test post',
    content: [],
    author: {
      id: 1,
      documentId: 'user-1',
      username: 'testuser',
      email: 'test@example.com',
      provider: 'local',
      confirmed: true,
      blocked: false,
      role: {
        id: 1,
        name: 'Authenticated',
        description: '',
        type: UserRoleType.AUTHENTICATED,
      },
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    publishedAt: '2026-01-01T00:00:00.000Z',
    commentsTotal: 0,
  };

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    postsStore = jasmine.createSpyObj('PostsStore', ['setCurrentPost']);

    TestBed.overrideComponent(PostCard, {
      set: {
        template: '',
      },
    });

    await TestBed.configureTestingModule({
      imports: [PostCard],
      providers: [
        { provide: Router, useValue: router },
        { provide: PostsStore, useValue: postsStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('post', mockPost);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('navigateToPost', () => {
    it('should set current post and navigate to post detail', () => {
      component.navigateToPost(mockPost);

      expect(postsStore.setCurrentPost).toHaveBeenCalledWith(mockPost);
      expect(router.navigate).toHaveBeenCalledWith(['/post', mockPost.documentId]);
    });
  });
});
