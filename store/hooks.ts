import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAuthState = () => {
  const auth = useAppSelector((state) => state.auth);
  const isAuthenticated = !!auth.token;
  const isAdmin = auth.user?.role === 'admin' || auth.user?.role === 'superAdmin';
  return { ...auth, isAuthenticated, isAdmin };
};

export const useAuthActions = () => {
  const dispatch = useAppDispatch();
  const { setUser, logout } = require('./authSlice'); 
  // Note: we can't easily export bound actions here without causing circular dependencies or strict structure requirements. 
  // It's better components use `dispatch(setUser(...))` directly or we wrap them here.
  // For now, let's keep it simple and just return the redux dispatch or bind them if imported.
  
  return {
    setUser: (data: any) => dispatch(setUser(data)),
    logout: () => dispatch(logout()),
  };
};
