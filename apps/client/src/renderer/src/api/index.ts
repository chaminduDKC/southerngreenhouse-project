import { api } from './apiClient'
import type { 
  LoginRequest, CreateClientDTO, UpdateClientDTO,
  CreateInventoryItemDTO, UpdateInventoryItemDTO, CreateAllocationDTO,
  CreateProjectDTO, UpdateProjectDTO, CreateSubProjectDTO, UpdateSubProjectDTO,
  CreateChildProjectDTO, UpdateChildProjectDTO,
  CreateLedgerEntryDTO, UpdateLedgerEntryDTO,
  CreateQuotationDTO, UpdateQuotationDTO,
  CreateInvoiceDTO, UpdateInvoiceDTO,
  CreateWorkerDTO, UpdateWorkerDTO,
  CreateAttendanceDTO, UpdateAttendanceDTO, BulkAttendanceDTO,
  CalculateSalaryDTO, SaveSalaryDTO, UpdateSalaryDTO,
  CreateManualAllocationDTO, UpdateManualAllocationDTO, TargetType
} from '@sg/types'

// auth
export const login = (data: LoginRequest) => api.post('/auth/login', data).then(r => r.data.data)
export const logout = () => api.post('/auth/logout').then(r => r.data.data)

// clients
export const getClients = (search?: string) => api.get('/clients', { params: { search } }).then(r => r.data.data)
export const getClient = (id: string) => api.get(`/clients/${id}`).then(r => r.data.data)
export const createClient = (data: CreateClientDTO) => api.post('/clients', data).then(r => r.data.data)
export const updateClient = (id: string, data: UpdateClientDTO) => api.put(`/clients/${id}`, data).then(r => r.data.data)
export const deleteClient = (id: string) => api.delete(`/clients/${id}`).then(r => r.data.data)

// inventory
export const getInventory = (search?: string) => api.get('/inventory', { params: { search } }).then(r => r.data.data)
export const getInventoryItem = (id: string) => api.get(`/inventory/${id}`).then(r => r.data.data)
export const createInventoryItem = (data: CreateInventoryItemDTO) => api.post('/inventory', data).then(r => r.data.data)
export const updateInventoryItem = (id: string, data: UpdateInventoryItemDTO) => api.put(`/inventory/${id}`, data).then(r => r.data.data)
export const deleteInventoryItem = (id: string) => api.delete(`/inventory/${id}`).then(r => r.data.data)
export const getEligibleAllocationTargets = () => api.get('/inventory/allocation-targets').then(r => r.data.data)
export const allocateInventory = (data: CreateAllocationDTO) => api.post('/inventory/allocate', data).then(r => r.data.data)
export const getInventoryAllocations = (id: string) => api.get(`/inventory/${id}/allocations`).then(r => r.data.data)

// projects
export const getProjects = () => api.get('/projects').then(r => r.data.data)
export const getProject = (id: string) => api.get(`/projects/${id}`).then(r => r.data.data)
export const createProject = (data: CreateProjectDTO) => api.post('/projects', data).then(r => r.data.data)
export const updateProject = (id: string, data: UpdateProjectDTO) => api.put(`/projects/${id}`, data).then(r => r.data.data)
export const deleteProject = (id: string) => api.delete(`/projects/${id}`).then(r => r.data.data)
export const getProjectAllocations = (id: string, targetType: 'projects'|'subprojects'|'childprojects') => api.get(`/projects/${id}/allocations`, { params: { targetType } }).then(r => r.data.data)
export const markProjectUsed = (id: string, targetType: 'projects'|'subprojects'|'childprojects') => api.post(`/projects/${id}/mark-used`, { targetType }).then(r => r.data.data)

// subprojects
export const getSubProject = (id: string) => api.get(`/subprojects/${id}`).then(r => r.data.data)
export const createSubProject = (data: CreateSubProjectDTO) => api.post('/subprojects', data).then(r => r.data.data)
export const updateSubProject = (id: string, data: UpdateSubProjectDTO) => api.put(`/subprojects/${id}`, data).then(r => r.data.data)
export const deleteSubProject = (id: string) => api.delete(`/subprojects/${id}`).then(r => r.data.data)
export const getSubProjectAllocations = (id: string) => api.get(`/subprojects/${id}/allocations`).then(r => r.data.data)
export const markSubProjectUsed = (id: string) => api.post(`/subprojects/${id}/mark-used`).then(r => r.data.data)

// childprojects
export const getChildProject = (id: string) => api.get(`/childprojects/${id}`).then(r => r.data.data)
export const createChildProject = (data: CreateChildProjectDTO) => api.post('/childprojects', data).then(r => r.data.data)
export const updateChildProject = (id: string, data: UpdateChildProjectDTO) => api.put(`/childprojects/${id}`, data).then(r => r.data.data)
export const deleteChildProject = (id: string) => api.delete(`/childprojects/${id}`).then(r => r.data.data)
export const getChildProjectAllocations = (id: string) => api.get(`/childprojects/${id}/allocations`).then(r => r.data.data)
export const markChildProjectUsed = (id: string) => api.post(`/childprojects/${id}/mark-used`).then(r => r.data.data)

// ledger
export const getLedger = (page?: number, pageSize?: number) => api.get('/ledger', { params: { page, pageSize } }).then(r => r.data)
export const getLedgerEntry = (id: string) => api.get(`/ledger/${id}`).then(r => r.data.data)
export const createLedgerEntry = (data: CreateLedgerEntryDTO) => api.post('/ledger', data).then(r => r.data.data)
export const updateLedgerEntry = (id: string, data: UpdateLedgerEntryDTO) => api.put(`/ledger/${id}`, data).then(r => r.data.data)
export const deleteLedgerEntry = (id: string) => api.delete(`/ledger/${id}`).then(r => r.data.data)
export const getLastLedgerEntry = () => api.get('/ledger', { params: { page: 1, pageSize: 1 } }).then(r => r.data?.data?.[0] ?? null)

// quotations
export const getQuotations = () => api.get('/quotations').then(r => r.data.data)
export const getQuotation = (id: string) => api.get(`/quotations/${id}`).then(r => r.data.data)
export const createQuotation = (data: CreateQuotationDTO) => api.post('/quotations', data).then(r => r.data.data)
export const updateQuotation = (id: string, data: UpdateQuotationDTO) => api.put(`/quotations/${id}`, data).then(r => r.data.data)
export const deleteQuotation = (id: string) => api.delete(`/quotations/${id}`).then(r => r.data.data)

// invoices
export const getInvoices = () => api.get('/invoices').then(r => r.data.data)
export const getInvoice = (id: string) => api.get(`/invoices/${id}`).then(r => r.data.data)
export const createInvoice = (data: CreateInvoiceDTO) => api.post('/invoices', data).then(r => r.data.data)
export const updateInvoice = (id: string, data: UpdateInvoiceDTO) => api.put(`/invoices/${id}`, data).then(r => r.data.data)
export const deleteInvoice = (id: string) => api.delete(`/invoices/${id}`).then(r => r.data.data)

// workers
export const getWorkers = () => api.get('/workers').then(r => r.data.data)
export const getWorker = (id: string) => api.get(`/workers/${id}`).then(r => r.data.data)
export const createWorker = (data: CreateWorkerDTO) => api.post('/workers', data).then(r => r.data.data)
export const updateWorker = (id: string, data: UpdateWorkerDTO) => api.put(`/workers/${id}`, data).then(r => r.data.data)
export const deleteWorker = (id: string) => api.delete(`/workers/${id}`).then(r => r.data.data)

// attendance
export const getAttendance = (params: {workerId?: string, date?: string, startDate?: string, endDate?: string}) => api.get('/attendance', { params }).then(r => r.data.data)
export const createAttendance = (data: CreateAttendanceDTO) => api.post('/attendance', data).then(r => r.data.data)
export const bulkAttendance = (data: BulkAttendanceDTO) => api.post('/attendance/bulk', data).then(r => r.data.data)
export const updateAttendance = (id: string, data: UpdateAttendanceDTO) => api.put(`/attendance/${id}`, data).then(r => r.data.data)
export const deleteAttendance = (id: string) => api.delete(`/attendance/${id}`).then(r => r.data.data)

// salary
export const getSalaries = () => api.get('/salary').then(r => r.data.data)
export const getSalary = (id: string) => api.get(`/salary/${id}`).then(r => r.data.data)
export const getSalaryHistory = (id: string) => api.get(`/salary/${id}/history`).then(r => r.data.data)
export const calculateSalary = (data: CalculateSalaryDTO) => api.post('/salary/calculate', data).then(r => r.data.data)
export const saveSalary = (data: SaveSalaryDTO) => api.post('/salary', data).then(r => r.data.data)
export const updateSalary = (id: string, data: UpdateSalaryDTO) => api.put(`/salary/${id}`, data).then(r => r.data.data)
export const deleteSalary = (id: string) => api.delete(`/salary/${id}`).then(r => r.data.data)

// dashboard
export const getDashboardStats = () => api.get('/dashboard/stats').then(r => r.data.data)

// manual allocations
export const getManualAllocations = (targetType: string, targetId: string) =>
  api.get('/manual-allocations', { params: { targetType, targetId } }).then(r => r.data.data)
export const getAggregatedManualAllocations = (targetType: string, targetId: string) =>
  api.get('/manual-allocations', { params: { targetType, targetId, aggregated: 'true' } }).then(r => r.data.data)
export const createManualAllocation = (data: CreateManualAllocationDTO) =>
  api.post('/manual-allocations', data).then(r => r.data.data)
export const updateManualAllocation = (id: string, data: UpdateManualAllocationDTO) =>
  api.put(`/manual-allocations/${id}`, data).then(r => r.data.data)
export const deleteManualAllocation = (id: string) =>
  api.delete(`/manual-allocations/${id}`).then(r => r.data.data)
