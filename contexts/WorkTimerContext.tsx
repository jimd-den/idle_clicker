import React, { createContext, useState, useEffect, useContext } from 'react';

type WorkTimerContextType = {
    isRunning: boolean;
    elapsedTime: number;
    clicks: number;
    startTimer: () => void;
    pauseTimer: () => void;
    incrementClicks: () => void;
    reset: () => void;
};

const defaultContextValue: WorkTimerContextType = {
    isRunning: false,
    elapsedTime: 0,
    clicks: 0,
    startTimer: () => { },
    pauseTimer: () => { },
    incrementClicks: () => { },
    reset: () => { },
};

const WorkTimerContext = createContext<WorkTimerContextType>(defaultContextValue);

export const WorkTimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [clicks, setClicks] = useState(0);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (isRunning) {
            intervalId = setInterval(() => {
                setElapsedTime((prevTime) => prevTime + 1000);
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [isRunning]);

    const startTimer = () => {
        setIsRunning(true);
    };

    const pauseTimer = () => {
        setIsRunning(false);
    };

    const incrementClicks = () => {
        setClicks((prevClicks) => prevClicks + 1);
    };

    const reset = () => {
        setIsRunning(false);
        setElapsedTime(0);
        setClicks(0);
    };

    return (
        <WorkTimerContext.Provider value={{ isRunning, elapsedTime, clicks, startTimer, pauseTimer, incrementClicks, reset }}>
            {children}
        </WorkTimerContext.Provider>
    );
};

export const useWorkTimer = () => useContext(WorkTimerContext);
