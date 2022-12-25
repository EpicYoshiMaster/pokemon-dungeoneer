import React, { useReducer, createContext, useContext } from 'react';

interface Action {
	type: string;
	[extraProps: string]: unknown;
  }

interface PreparedContextualReducerResource<S, A> {
	connect: <T>(component: React.FC<T>) => React.FC<T>;
	useState: () => S;
	useDispatch: () => React.Dispatch<A>;
  }

export function prepareContextualReducer<S, A extends Action>(
	reducer: React.Reducer<S, A>,
	initialState: S,
  ): PreparedContextualReducerResource<S, A> {
	const StateContext = createContext<S | null>(null);
	const DispatchContext = createContext<React.Dispatch<A> | null>(null);
  
	//@ts-ignore
	const ReducerProvider: React.FC = ({ children }) => {
	  const [state, dispatch] = useReducer(reducer, initialState);
  
	  return (
		<StateContext.Provider value={state}>
		  <DispatchContext.Provider value={dispatch}>
			{children}
		  </DispatchContext.Provider>
		</StateContext.Provider>
	  );
	};
  
	return {
	  connect<T>(Component: React.FC<T>): React.FC<T> {
		//@ts-ignore
		return (props: T): React.ReactElement => <ReducerProvider><Component {...props} /></ReducerProvider>;
	  },
	  useState: (): S => useContext(StateContext) as S,
	  useDispatch: (): React.Dispatch<A> => useContext(DispatchContext) as React.Dispatch<A>,
	};
  }