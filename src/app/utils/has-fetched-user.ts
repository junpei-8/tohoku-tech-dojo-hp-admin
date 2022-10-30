import { auth } from '../firebase';

export const hasFetchedUser = {
  current: false,
};

(() => {
  const unsubscribe = auth.onAuthStateChanged(() => {
    hasFetchedUser.current = true;
    unsubscribe();
  });
})();
