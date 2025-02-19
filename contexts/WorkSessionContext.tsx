import React, { createContext, useRef } from 'react';
import { WorkSession } from '@/domain/entities/WorkSession';

interface WorkSessionContextProps {
  workSession: WorkSession;
}

// Create context for WorkSession
export const WorkSessionContext = createContext<WorkSessionContextProps | undefined>(
  undefined
);

export const WorkSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const workSessionRef = useRef<WorkSession | null>(null);
  if (!workSessionRef.current) {
    workSessionRef.current = new WorkSession();
  }
  const workSession = workSessionRef.current;

  return (
    <WorkSessionContext.Provider value={{ workSession }}>
      {children}
    </WorkSessionContext.Provider>
  );
};

export const useWorkSession = () => {
  const context = React.useContext(WorkSessionContext);
  if (!context) {
    throw new Error("useWorkSession must be used within a WorkSessionProvider");
  }
  return context.workSession;
};
