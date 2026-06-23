export type CurrentUser = {
  id: string;
  name?: string;
  email?: string;
  picture?: string;
};

export const CURRENT_USER_KEY = 'jat-people-current-user';
export const AUTH_CHANGED_EVENT = 'jat-people-auth-changed';

export const getCurrentUser = (): CurrentUser | null => {
  try {
    const savedUser = window.localStorage.getItem(CURRENT_USER_KEY);
    if (!savedUser) {
      return null;
    }

    const parsedUser = JSON.parse(savedUser);
    return typeof parsedUser?.id === 'string' ? (parsedUser as CurrentUser) : null;
  } catch {
    return null;
  }
};

export const setCurrentUser = (user: CurrentUser) => {
  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};

export const clearCurrentUser = () => {
  window.localStorage.removeItem(CURRENT_USER_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};
