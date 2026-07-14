import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { of } from 'rxjs';
import { TableLoadParams } from '../../models';
import { PostApi } from '../../services/post-api';
import { PostsStore } from '../../store/posts.store';
import { PostsList } from './posts-list';

describe('PostsList', () => {
  let component: PostsList;
  let fixture: ComponentFixture<PostsList>;
  let postApi: jasmine.SpyObj<Pick<PostApi, 'getPosts'>>;
  let postsStore: jasmine.SpyObj<
    Pick<InstanceType<typeof PostsStore>, 'resetPostsLoadParams' | 'resetPosts' | 'setPosts'>
  > & {
    posts: {
      (): {
        data: { meta: { pagination: { page: number; pageCount: number; total: number } } };
      };
      data: { data: unknown[] };
      isLoading: () => boolean;
      lastLoadParams: () => TableLoadParams;
    };
  };

  const lastLoadParams: TableLoadParams = {
    page: 1,
    pageSize: 10,
    sort: { field: 'createdAt', order: 'desc' },
  };

  const paginationState = {
    page: 1,
    pageCount: 2,
    total: 2,
  };
  let loadingState = false;

  beforeEach(async () => {
    const postsAccessor = Object.assign(
      () => ({
        data: {
          meta: {
            pagination: paginationState,
          },
        },
      }),
      {
        data: {
          data: [],
        },
        isLoading: () => loadingState,
        lastLoadParams: () => lastLoadParams,
      },
    );

    postsStore = {
      posts: postsAccessor,
      resetPostsLoadParams: jasmine.createSpy('resetPostsLoadParams'),
      resetPosts: jasmine.createSpy('resetPosts'),
      setPosts: jasmine.createSpy('setPosts'),
    } as unknown as typeof postsStore;

    postApi = jasmine.createSpyObj('PostApi', ['getPosts']);
    postApi.getPosts.and.returnValue(
      of({
        data: [],
        meta: {
          pagination: {
            page: 1,
            pageSize: 10,
            pageCount: 2,
            total: 2,
          },
        },
      }),
    );

    TestBed.overrideComponent(PostsList, {
      set: {
        template: '',
      },
    });

    await TestBed.configureTestingModule({
      imports: [PostsList],
      providers: [
        { provide: PostsStore, useValue: postsStore },
        { provide: PostApi, useValue: postApi },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('hasMorePosts', () => {
    it('should return true when page is lower than pageCount and total is positive', () => {
      paginationState.page = 1;
      paginationState.pageCount = 3;
      paginationState.total = 5;

      expect(component.hasMorePosts()).toBeTrue();
    });

    it('should return false when there are no more pages', () => {
      paginationState.page = 3;
      paginationState.pageCount = 3;
      paginationState.total = 5;

      expect(component.hasMorePosts()).toBeFalse();
    });

    it('should return false when total is zero', () => {
      paginationState.page = 1;
      paginationState.pageCount = 3;
      paginationState.total = 0;

      expect(component.hasMorePosts()).toBeFalse();
    });
  });

  describe('ngOnChanges', () => {
    it('should reset params and load posts when parentDocumentId changes', () => {
      component.parentDocumentId = 'parent-1';

      component.ngOnChanges({
        parentDocumentId: new SimpleChange(undefined, 'parent-1', true),
      });

      expect(postsStore.resetPostsLoadParams).toHaveBeenCalled();
      expect(postsStore.resetPosts).toHaveBeenCalled();
      expect(postApi.getPosts).toHaveBeenCalledWith(
        lastLoadParams,
        'parent-1',
        undefined,
      );
    });

    it('should reset params and load posts when authorDocumentId changes', () => {
      component.authorDocumentId = 'user-1';

      component.ngOnChanges({
        authorDocumentId: new SimpleChange(undefined, 'user-1', true),
      });

      expect(postsStore.resetPostsLoadParams).toHaveBeenCalled();
      expect(postsStore.resetPosts).toHaveBeenCalled();
      expect(postApi.getPosts).toHaveBeenCalledWith(
        lastLoadParams,
        undefined,
        'user-1',
      );
    });
  });

  describe('onInfiniteScroll', () => {
    it('should load more posts when there are more posts and loading is false', () => {
      paginationState.page = 1;
      paginationState.pageCount = 3;
      paginationState.total = 5;
      loadingState = false;

      component.onInfiniteScroll();

      expect(postApi.getPosts).toHaveBeenCalledWith(
        { ...lastLoadParams, page: lastLoadParams.page + 1 },
        undefined,
        undefined,
      );
    });

    it('should not load more posts when loading is true', () => {
      loadingState = true;
      postApi.getPosts.calls.reset();

      component.onInfiniteScroll();

      expect(postApi.getPosts).not.toHaveBeenCalled();
    });

    it('should not load more posts when there are no more posts', () => {
      loadingState = false;
      paginationState.page = 2;
      paginationState.pageCount = 2;
      paginationState.total = 5;
      postApi.getPosts.calls.reset();

      component.onInfiniteScroll();

      expect(postApi.getPosts).not.toHaveBeenCalled();
    });
  });
});
