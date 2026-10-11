import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

const SystemContext = createContext(null);

export const SystemProvider = ({ children }) => {
  const [isBackendHealthy, setIsBackendHealthy] = useState(null); // null = checking, true = up, false = down
  const [backendStatusInfo, setBackendStatusInfo] = useState('');
  const [refreshIndex, setRefreshIndex] = useState(0);

  const checkHealth = useCallback(async () => {
    try {
      const data = await api.getHealth();
      if (data.status === 'ok') {
        setIsBackendHealthy(true);
        setBackendStatusInfo(data.message || 'FastAPI Online');
      } else {
        setIsBackendHealthy(false);
        setBackendStatusInfo('Backend unreachable');
      }
    } catch (e) {
      setIsBackendHealthy(false);
      setBackendStatusInfo(e.message || 'Backend unreachable');
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  const triggerGlobalRefresh = () => {
    setRefreshIndex((prev) => prev + 1);
    checkHealth();
  };

  return (
    <SystemContext.Provider
      value={{
        isBackendHealthy,
        backendStatusInfo,
        checkHealth,
        refreshIndex,
        triggerGlobalRefresh,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const ctx = useContext(SystemContext);
  if (!ctx) throw new Error('useSystem must be used within SystemProvider');
  return ctx;
};
