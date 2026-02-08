// src/lib/hooks/useInvestigation.ts

import { useInvestigationStore } from "@/lib/store/investigationStore";

export const useInvestigation = () => {
  const {
    investigations,
    currentInvestigation,
    stats,
    isLoading,
    error,
    fetchInvestigations,
    fetchInvestigation,
    createInvestigation,
    updateInvestigation,
    deleteInvestigation,
    pauseInvestigation,
    resumeInvestigation,
    cancelInvestigation,
    redirectInvestigation,
    fetchStats,
    setCurrentInvestigation,
    clearError,
  } = useInvestigationStore();

  return {
    investigations,
    currentInvestigation,
    stats,
    isLoading,
    error,
    fetchInvestigations,
    fetchInvestigation,
    createInvestigation,
    updateInvestigation,
    deleteInvestigation,
    pauseInvestigation,
    resumeInvestigation,
    cancelInvestigation,
    redirectInvestigation,
    fetchStats,
    setCurrentInvestigation,
    clearError,
  };
};
