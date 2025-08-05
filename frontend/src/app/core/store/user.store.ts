import {
  patchState,
  signalStore,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { User } from '../models/auth';
import { toObservable } from '@angular/core/rxjs-interop';
import { UserData } from '../models';

type UserState = {
  me: {
    data: User | null;
    isLoading: boolean;
  };
  users: {
    data: UserData[];
    isLoading: boolean;
  };
};

const initialState: UserState = {
  me: {
    data: null,
    isLoading: false,
  },
  users: {
    data: [],
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
    setUsers(users: UserData[]) {
      patchState(store, { users: { ...store.users(), data: users } });
    },
    setUsersLoading(isLoading: boolean) {
      patchState(store, { users: { ...store.users(), isLoading } });
    },
  }))
);
