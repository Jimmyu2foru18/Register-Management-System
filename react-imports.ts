import React from 'react';
import type { 
  ChangeEvent, 
  ReactElement, 
  ReactNode, 
  FormEvent,
  DragEvent,
  MouseEvent,
  PropsWithChildren,
  SetStateAction,
  ChangeEventHandler,
  Dispatch
} from 'react';

export type { 
  ChangeEvent, 
  ReactElement, 
  ReactNode, 
  FormEvent,
  DragEvent,
  MouseEvent,
  PropsWithChildren,
  SetStateAction,
  ChangeEventHandler,
  Dispatch
};

export const {
  useState,
  useEffect,
  useContext,
  createContext,
  useRef,
  useCallback,
  useMemo,
  useReducer,
} = React;

export type FC<P = Record<string, never>> = React.FC<P>;
export default React;
