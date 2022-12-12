import React from 'react';

export const DashboardContext = React.createContext({});

export const useDashboard = () => React.useContext(DashboardContext);

export const DashboardProvider = DashboardContext.Provider;
