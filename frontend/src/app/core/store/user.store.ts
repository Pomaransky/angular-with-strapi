import {
  patchState,
  signalStore,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { User } from '../models/auth';
import { toObservable } from '@angular/core/rxjs-interop';

type UserState = {
  user: User | null;
  isLoading: boolean;
};

const initialState: UserState = {
  user: null,
  isLoading: false,
};

export const UserStore = signalStore(
  withState<UserState>(initialState),
  withProps(({ isLoading }) => ({
    isLoading$: toObservable(isLoading),
  })),
  withMethods((store) => ({
    setUser(user: User | null) {
      patchState(store, { user });
    },
    setLoading(isLoading: boolean) {
      patchState(store, { isLoading });
    },
  }))
);
