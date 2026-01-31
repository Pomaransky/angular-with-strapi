import {
  patchState,
  signalStore,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { toObservable } from '@angular/core/rxjs-interop';
import { Paginated, User } from '../models';
import { initialPaginatedState } from '../utils/initial-paginated-state';

type UserState = {
  me: {
    data: User | null;
    isLoading: boolean;
  };
  users: {
    data: Paginated<User>;
    isLoading: boolean;
  };
};

const initialState: UserState = {
  me: {
    data: null,
    isLoading: false,
  },
  users: {
    data: initialPaginatedState<User>([]),
    isLoading: false,
  },
};

export const UserStore = signalStore(
  withState<UserState>(initialState),
  withProps(({ me, users }) => ({
    me$: toObservable(me),
    users$: toObservable(users),
  })),
  withMethods((store) => ({
    setMe(user: User | null) {
      patchState(store, { me: { ...store.me(), data: user } });
    },
    setMeLoading(isLoading: boolean) {
      patchState(store, { me: { ...store.me(), isLoading } });
    },
    setUsers(users: Paginated<User>) {
      patchState(store, { users: { ...store.users(), data: users } });
    },
    setUsersLoading(isLoading: boolean) {
      patchState(store, { users: { ...store.users(), isLoading } });
    },
    updateUser(userId: number, updates: Partial<User>) {
      const currentUsers = store.users().data;
      const updatedData = currentUsers.data.map((user) =>
        user.id === userId ? { ...user, ...updates } : user,
      );

      patchState(store, {
        users: {
          ...store.users(),
          data: { ...currentUsers, data: updatedData },
        },
      });
    },
  })),
);
