import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/common/Layout';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { UploadPage } from './features/upload/UploadPage';
import { ConfigurePage } from './features/configure/ConfigurePage';
import { OptimizePage } from './features/optimize/OptimizePage';
import { ResultsPage } from './features/results/ResultsPage';
import { HistoryPage } from './features/history/HistoryPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/configure" element={<ConfigurePage />} />
          <Route path="/optimize" element={<OptimizePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
