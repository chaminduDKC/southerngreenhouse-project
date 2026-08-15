import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '../api'

// Dashboard
export const useDashboardStats = () => useQuery({ queryKey: ['dashboard'], queryFn: api.getDashboardStats })

// Clients
export const useClients = (search?: string) => useQuery({ queryKey: ['clients', search], queryFn: () => api.getClients(search) })
export const useClient = (id: string) => useQuery({ queryKey: ['clients', id], queryFn: () => api.getClient(id) })
export const useCreateClient = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: api.createClient, onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }) })
}
export const useUpdateClient = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, data }: { id: string, data: any }) => api.updateClient(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }) })
}
export const useDeleteClient = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: api.deleteClient, onSuccess: () => {qc.invalidateQueries({ queryKey: ['clients'] }); qc.invalidateQueries({ queryKey: ['dashboard'] })} })
}

// Inventory
export const useInventory = (search?: string) => useQuery({ queryKey: ['inventory', search], queryFn: () => api.getInventory(search) })
export const useInventoryItem = (id: string) => useQuery({ queryKey: ['inventory', id], queryFn: () => api.getInventoryItem(id) })
export const useCreateInventoryItem = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: api.createInventoryItem, onSuccess: () => qc.invalidateQueries({ queryKey: ['inventory'] }) })
}
export const useUpdateInventoryItem = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, data }: { id: string, data: any }) => api.updateInventoryItem(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['inventory'] }) })
}
export const useDeleteInventoryItem = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: api.deleteInventoryItem, onSuccess: () => qc.invalidateQueries({ queryKey: ['inventory'] }) })
}
export const useEligibleAllocationTargets = () => useQuery({ queryKey: ['inventory-targets'], queryFn: api.getEligibleAllocationTargets })
export const useAllocateInventory = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: api.allocateInventory, onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['inventory'] })
    qc.invalidateQueries({ queryKey: ['projects'] })
    qc.invalidateQueries({ queryKey: ['dashboard'] })
  }})
}
export const useInventoryAllocations = (id: string) => useQuery({ queryKey: ['inventory-allocations', id], queryFn: () => api.getInventoryAllocations(id) })

// Projects
export const useProjects = () => useQuery({ queryKey: ['projects'], queryFn: api.getProjects })
export const useProject = (id: string) => useQuery({ queryKey: ['projects', id], queryFn: () => api.getProject(id) })
export const useCreateProject = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: api.createProject, onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }) })
}
export const useUpdateProject = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, data }: { id: string, data: any }) => api.updateProject(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }) })
}
export const useDeleteProject = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: api.deleteProject, onSuccess: () => {qc.invalidateQueries({ queryKey: ['projects'] }); qc.invalidateQueries({queryKey:["quotations"]})} })
}
export const useProjectAllocations = (id: string, targetType: 'projects'|'subprojects'|'childprojects') => useQuery({ queryKey: ['project-allocations', id, targetType], queryFn: () => api.getProjectAllocations(id, targetType) })
export const useMarkProjectUsed = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, targetType }: { id: string, targetType: 'projects'|'subprojects'|'childprojects' }) => api.markProjectUsed(id, targetType), onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }) })
}

// SubProjects
export const useSubProject = (id: string) => useQuery({ queryKey: ['subprojects', id], queryFn: () => api.getSubProject(id) })
export const useCreateSubProject = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: api.createSubProject, onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['projects'] })
    qc.invalidateQueries({ queryKey: ['subprojects'] })
  }})
}
export const useUpdateSubProject = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, data }: { id: string, data: any }) => api.updateSubProject(id, data), onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['projects'] })
    qc.invalidateQueries({ queryKey: ['subprojects'] })
  }})
}
export const useDeleteSubProject = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: api.deleteSubProject, onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['projects'] })
    qc.invalidateQueries({ queryKey: ['subprojects'] })
    qc.invalidateQueries({ queryKey: ['manualAllocations'] })
  }})
}
export const useSubProjectAllocations = (id: string) => useQuery({ queryKey: ['subproject-allocations', id], queryFn: () => api.getSubProjectAllocations(id) })
export const useMarkSubProjectUsed = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => api.markSubProjectUsed(id), onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['projects'] })
    qc.invalidateQueries({ queryKey: ['subprojects'] })
  }})
}

// ChildProjects
export const useChildProject = (id: string) => useQuery({ queryKey: ['childprojects', id], queryFn: () => api.getChildProject(id) })
export const useCreateChildProject = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: api.createChildProject, onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['projects'] })
    qc.invalidateQueries({ queryKey: ['subprojects'] })
    qc.invalidateQueries({ queryKey: ['childprojects'] })
  }})
}
export const useUpdateChildProject = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, data }: { id: string, data: any }) => api.updateChildProject(id, data), onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['projects'] })
    qc.invalidateQueries({ queryKey: ['childprojects'] })
  }})
}
export const useDeleteChildProject = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: api.deleteChildProject, onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['projects'] })
    qc.invalidateQueries({ queryKey: ['childprojects'] })
    qc.invalidateQueries({ queryKey: ['manualAllocations'] })
  }})
}
export const useChildProjectAllocations = (id: string) => useQuery({ queryKey: ['childproject-allocations', id], queryFn: () => api.getChildProjectAllocations(id) })
export const useMarkChildProjectUsed = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => api.markChildProjectUsed(id), onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['projects'] })
    qc.invalidateQueries({ queryKey: ['childprojects'] })
  }})
}

// Ledger
export const useLedger = (page?: number, pageSize?: number) => useQuery({ queryKey: ['ledger', page, pageSize], queryFn: () => api.getLedger(page, pageSize) })
export const useLedgerEntry = (id: string) => useQuery({ queryKey: ['ledger', id], queryFn: () => api.getLedgerEntry(id) })
export const useCreateLedgerEntry = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: api.createLedgerEntry, onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['ledger'] })
    qc.invalidateQueries({ queryKey: ['projects'] })
    qc.invalidateQueries({ queryKey: ['attendance'] })
    qc.invalidateQueries({ queryKey: ['salary'] })
    qc.invalidateQueries({ queryKey: ['dashboard'] })
  }})
}
export const useUpdateLedgerEntry = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, data }: { id: string, data: any }) => api.updateLedgerEntry(id, data), onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['ledger'] })
    qc.invalidateQueries({ queryKey: ['projects'] })
    qc.invalidateQueries({ queryKey: ['attendance'] })
    qc.invalidateQueries({ queryKey: ['salary'] })
    qc.invalidateQueries({ queryKey: ['dashboard'] })
  }})
}
export const useDeleteLedgerEntry = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: api.deleteLedgerEntry, onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['ledger'] })
    qc.invalidateQueries({ queryKey: ['projects'] })
    qc.invalidateQueries({ queryKey: ['attendance'] })
    qc.invalidateQueries({ queryKey: ['salary'] })
    qc.invalidateQueries({ queryKey: ['dashboard'] })
  }})
}
export const useLastLedgerEntry = () => useQuery({ queryKey: ['ledger', 'last'], queryFn: api.getLastLedgerEntry })

// Quotations
export const useQuotations = () => useQuery({ queryKey: ['quotations'], queryFn: api.getQuotations })
export const useQuotation = (id: string) => useQuery({ queryKey: ['quotations', id], queryFn: () => api.getQuotation(id) })
export const useCreateQuotation = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: api.createQuotation, onSuccess: () => qc.invalidateQueries({ queryKey: ['quotations'] }) })
}
export const useUpdateQuotation = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, data }: { id: string, data: any }) => api.updateQuotation(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['quotations'] }) })
}
export const useDeleteQuotation = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: api.deleteQuotation, onSuccess: () => qc.invalidateQueries({ queryKey: ['quotations'] }) })
}

// Invoices
export const useInvoices = () => useQuery({ queryKey: ['invoices'], queryFn: api.getInvoices })
export const useInvoice = (id: string) => useQuery({ queryKey: ['invoices', id], queryFn: () => api.getInvoice(id) })
export const useCreateInvoice = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: api.createInvoice, onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }) })
}
export const useUpdateInvoice = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, data }: { id: string, data: any }) => api.updateInvoice(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }) })
}
export const useDeleteInvoice = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: api.deleteInvoice, onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }) })
}

// Workers
export const useWorkers = () => useQuery({ queryKey: ['workers'], queryFn: api.getWorkers })
export const useWorker = (id: string) => useQuery({ queryKey: ['workers', id], queryFn: () => api.getWorker(id) })
export const useCreateWorker = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: api.createWorker, onSuccess: () => qc.invalidateQueries({ queryKey: ['workers'] }) })
}
export const useUpdateWorker = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, data }: { id: string, data: any }) => api.updateWorker(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['workers'] }) })
}
export const useDeleteWorker = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: api.deleteWorker, onSuccess: () => qc.invalidateQueries({ queryKey: ['workers'] }) })
}

// Attendance
export const useAttendance = (params: {workerId?: string, date?: string, startDate?: string, endDate?: string}) => useQuery({ queryKey: ['attendance', params], queryFn: () => api.getAttendance(params) })
export const useCreateAttendance = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: api.createAttendance, onSuccess: () => qc.invalidateQueries({ queryKey: ['attendance'] }) })
}
export const useBulkAttendance = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: api.bulkAttendance, onSuccess: () => qc.invalidateQueries({ queryKey: ['attendance'] }) })
}
export const useUpdateAttendance = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, data }: { id: string, data: any }) => api.updateAttendance(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['attendance'] }) })
}
export const useDeleteAttendance = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: api.deleteAttendance, onSuccess: () => qc.invalidateQueries({ queryKey: ['attendance'] }) })
}

// Salary
export const useSalaries = () => useQuery({ queryKey: ['salaries'], queryFn: api.getSalaries })
export const useSalary = (id: string) => useQuery({ queryKey: ['salaries', id], queryFn: () => api.getSalary(id) })
export const useCalculateSalary = () => {
  return useMutation({ mutationFn: api.calculateSalary })
}
export const useSaveSalary = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: api.saveSalary, onSuccess: () => qc.invalidateQueries({ queryKey: ['salaries'] }) })
}
export const useUpdateSalary = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, data }: { id: string, data: any }) => api.updateSalary(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['salaries'] }) })
}

// Manual Allocations
export const useManualAllocations = (targetType: string, targetId: string) => 
  useQuery({ queryKey: ['manual-allocations', targetType, targetId], queryFn: () => api.getManualAllocations(targetType, targetId) })

export const useAggregatedManualAllocations = (targetType: string, targetId: string) => 
  useQuery({ queryKey: ['manual-allocations', 'aggregated', targetType, targetId], queryFn: () => api.getAggregatedManualAllocations(targetType, targetId) })

export const useCreateManualAllocation = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: api.createManualAllocation, onSuccess: () => qc.invalidateQueries({ queryKey: ['manual-allocations'] }) })
}

export const useUpdateManualAllocation = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, data }: { id: string, data: any }) => api.updateManualAllocation(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['manual-allocations'] }) })
}

export const useDeleteManualAllocation = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: api.deleteManualAllocation, onSuccess: () => qc.invalidateQueries({ queryKey: ['manual-allocations'] }) })
}

import { useEffect } from 'react'

export const useF1Shortcut = (callback: () => void) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault()
        callback()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [callback])
}
