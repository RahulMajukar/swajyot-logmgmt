import React from 'react';
import { DashboardLayout } from '../SharedComponents';
import FormDashboard from './FormDashboard';

const OperatorDashboard = ({ user, onLogout }) => {
  return (
    <DashboardLayout
      user={user}
      onLogout={onLogout}
      title="Operator Dashboard"
      subtitle="Manage production inspections and reports"
    >
      <FormDashboard user={user} onLogout={onLogout} />
    </DashboardLayout>
  );
};

export default OperatorDashboard;
