import {
  patchState,
  signalStore,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { Paginated, Post, TableLoadParams } from '../models';
import { initialPaginatedState } from '../utils/initial-paginated-state';
import { toObservable } from '@angular/core/rxjs-interop';

export const DEFAULT_POSTS_LOAD_PARAMS: TableLoadParams = {
  page: 1,
  pageSize: 10,
  sort: { field: 'createdAt', order: 'desc' },
};

interface PostsState {
  posts: {
    data: Paginated<Post>;
    isLoading: boolean;
    lastLoadParams: TableLoadParams;
  };
  currentPost: Post | null;
}

const initialState: PostsState = {
  posts: {
    data: initialPaginatedState<Post>([]),
    isLoading: false,
    lastLoadParams: DEFAULT_POSTS_LOAD_PARAMS,
  },
  currentPost: null,
};

export const PostsStore = signalStore(
  withState<PostsState>(initialState),
  withProps(({ posts }) => ({
    posts$: toObservable(posts),
  })),
  withMethods((store) => ({
    resetPostsLoadParams() {
      patchState(store, {
        posts: { ...store.posts(), lastLoadParams: DEFAULT_POSTS_LOAD_PARAMS },
      });
    },
    addPosts(posts: Paginated<Post>) {
      const current = store.posts().data;
      const params = store.posts().lastLoadParams;
      const existingIds = new Set(current.data.map((p) => p.documentId));
      const newPosts = posts.data.filter((p) => !existingIds.has(p.documentId));
      const merged: Paginated<Post> = {
        ...current,
        data: [...current.data, ...newPosts],
        meta: posts.meta,
      };
      patchState(store, {
        posts: {
          ...store.posts(),
          data: merged,
          lastLoadParams: {
            ...params,
            page: posts.meta.pagination.page,
            pageSize: posts.meta.pagination.pageSize,
          },
        },
      });
    },
    setPosts(posts: Paginated<Post>) {
      patchState(store, { posts: { ...store.posts(), data: posts } });
    },
    setPostsLoading(isLoading: boolean) {
      patchState(store, { posts: { ...store.posts(), isLoading } });
    },
    setCurrentPost(post: Post | null) {
      patchState(store, { currentPost: post });
    },
    prependPost(post: Post) {
      const current = store.posts().data;
      const merged: Paginated<Post> = {
        ...current,
        data: [post, ...current.data],
        meta: {
          ...current.meta,
          pagination: {
            ...current.meta.pagination,
            total: current.meta.pagination.total + 1,
          },
        },
      };
      patchState(store, { posts: { ...store.posts(), data: merged } });
    },
  })),
);
