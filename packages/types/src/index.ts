// ─── Enums ──────────────────────────────────────────────────────────────────

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
}

export enum TargetType {
  PROJECT = 'PROJECT',
  SUB_PROJECT = 'SUB_PROJECT',
  CHILD_PROJECT = 'CHILD_PROJECT',
}

export enum AllocationStatus {
  ALLOCATED = 'ALLOCATED',
  USED = 'USED',
}

export enum RateType {
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
}

export enum QuotationStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export enum DivisionMethod {
  EQUAL = 'EQUAL',
  PROPORTIONAL = 'PROPORTIONAL',
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: { id: string; email: string };
}

export interface TokenPayload {
  userId: string;
  jti: string;
  iat: number;
  exp: number;
}

// ─── Client ──────────────────────────────────────────────────────────────────

export interface ClientDTO {
  id: string;
  name: string;
  phone: string;
  address: string;
  createdAt: string;
  deletedAt: string | null;
  _count?: {
    projects: number;
    quotations: number;
    invoices: number;
  };
}

export interface CreateClientDTO {
  name: string;
  phone: string;
  address: string;
}

export type UpdateClientDTO = Partial<CreateClientDTO>;

// ─── Inventory ───────────────────────────────────────────────────────────────

export interface InventoryItemDTO {
  id: string;
  name: string;
  unit: string;
  unitSize: number;
  boughtPrice: number;
  soldPrice: number;
  quantity: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  createdAt: string;
}

export interface CreateInventoryItemDTO {
  name: string;
  unit: string;
  unitSize: number;
  boughtPrice: number;
  soldPrice: number;
  quantity: number;
  lowStockThreshold: number;
}

export type UpdateInventoryItemDTO = Partial<CreateInventoryItemDTO>;

export interface AllocationRowDTO {
  targetType: TargetType;
  targetId: string;
  quantity: number;
}

export interface CreateAllocationDTO {
  inventoryItemId: string;
  rows: AllocationRowDTO[];
}

export interface AllocationDTO {
  id: string;
  inventoryItemId: string;
  inventoryItem: { name: string; unit: string };
  targetType: TargetType;
  targetId: string;
  targetTitle: string;
  quantity: number;
  status: AllocationStatus;
  createdAt: string;
}

export interface AllocationTargetDTO {
  id: string;
  title: string;
  targetType: TargetType;
  location: string;
  status: ProjectStatus;
}

// ─── Manual Allocations ───────────────────────────────────────────────────────

export interface ManualAllocationDTO {
  id: string;
  targetType: TargetType;
  targetId: string;
  targetTitle?: string;
  itemName: string;
  unit: string;
  quantity: number;
  notes: string;
  createdAt: string;
}

export interface ManualAllocationAggregatedDTO {
  itemName: string;
  unit: string;
  totalQuantity: number;
  breakdown: {
    targetType: TargetType;
    targetId: string;
    targetTitle: string;
    quantity: number;
  }[];
}

export interface CreateManualAllocationDTO {
  targetType: TargetType;
  targetId: string;
  itemName: string;
  unit: string;
  quantity: number;
  notes?: string;
}

export type UpdateManualAllocationDTO = Partial<Omit<CreateManualAllocationDTO, 'targetType' | 'targetId'>>;

// ─── Projects ────────────────────────────────────────────────────────────────

export interface ChildProjectDTO {
  id: string;
  subProjectId: string;
  title: string;
  location: string;
  status: ProjectStatus;
  notes: string;
  value: number;
  cost: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubProjectDTO {
  id: string;
  projectId: string;
  title: string;
  location: string;
  status: ProjectStatus;
  notes: string;
  value: number;
  cost: number;
  children: ChildProjectDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDTO {
  id: string;
  clientId: string;
  client?: { id: string; name: string };
  title: string;
  location: string;
  status: ProjectStatus;
  notes: string;
  value: number;
  cost: number;
  subProjects: SubProjectDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDTO {
  clientId: string;
  title: string;
  location: string;
  status?: ProjectStatus;
  notes?: string;
  value?: number;
}

export type UpdateProjectDTO = Partial<Omit<CreateProjectDTO, 'clientId'>> & {
  status?: ProjectStatus;
  divisionMethod?: DivisionMethod;
};

export interface CreateSubProjectDTO {
  projectId: string;
  title: string;
  location: string;
  status?: ProjectStatus;
  notes?: string;
  value?: number;
}

export type UpdateSubProjectDTO = Partial<Omit<CreateSubProjectDTO, 'projectId'>>;

export interface CreateChildProjectDTO {
  subProjectId: string;
  title: string;
  location: string;
  status?: ProjectStatus;
  notes?: string;
  value?: number;
}

export type UpdateChildProjectDTO = Partial<Omit<CreateChildProjectDTO, 'subProjectId'>>;

// ─── Ledger ──────────────────────────────────────────────────────────────────

export interface LedgerWorkerAdvanceDTO {
  workerId: string;
  workerName?: string;
  advanceAmount: number;
  targetType?: TargetType;
  targetId?: string;
  targetTitle?: string;
}

export interface LedgerCompletedProjectDTO {
  targetType: TargetType;
  targetId: string;
  targetTitle?: string;
}

export interface LedgerAllocatedProjectDTO {
  targetType: TargetType;
  targetId: string;
  amount?: number;
}

export interface LedgerEntryDTO {
  id: string;
  date: string;
  openingBalance: number;
  paymentGivenToday: number;
  balanceReturnedToday: number;
  cost: number;
  workerAdvances: LedgerWorkerAdvanceDTO[];
  completedProjects: LedgerCompletedProjectDTO[];
  allocatedProjects: LedgerAllocatedProjectDTO[];
  isLatest: boolean;
  createdAt: string;
}

export interface CreateLedgerEntryDTO {
  date: string;
  openingBalance: number;
  paymentGivenToday: number;
  balanceReturnedToday: number;
  workerAdvances: LedgerWorkerAdvanceDTO[];
  completedProjects: LedgerCompletedProjectDTO[];
  allocatedProjects: LedgerAllocatedProjectDTO[];
}

export type UpdateLedgerEntryDTO = Partial<CreateLedgerEntryDTO>;

// ─── Quotation ───────────────────────────────────────────────────────────────

export interface QuotationItemDTO {
  id: string;
  quotationId: string;
  inventoryItemId: string | null;
  description: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export interface CreateQuotationItemDTO {
  inventoryItemId?: string;
  description: string;
  qty: number;
  unitPrice: number;
}

export interface QuotationDTO {
  id: string;
  clientId: string;
  client?: { id: string; name: string };
  projectId: string | null;
  project?: { id: string; title: string } | null;
  validUntil: string;
  transportCost: number;
  notes: string;
  status: QuotationStatus;
  total: number;
  items: QuotationItemDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuotationDTO {
  clientId: string;
  projectId?: string;
  validUntil: string;
  transportCost?: number;
  notes?: string;
  status?: QuotationStatus;
  items: CreateQuotationItemDTO[];
}

export type UpdateQuotationDTO = Partial<CreateQuotationDTO>;

// ─── Invoice ─────────────────────────────────────────────────────────────────

export interface InvoiceDTO {
  id: string;
  clientId: string;
  client?: { id: string; name: string };
  projectId: string;
  project?: { id: string; title: string };
  quotationId: string | null;
  quotation?: { id: string } | null;
  totalAmount: number;
  amountDue: number;
  dueDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceDTO {
  clientId: string;
  projectId: string;
  quotationId?: string;
  totalAmount: number;
  amountDue: number;
  dueDate: string;
  notes?: string;
}

export type UpdateInvoiceDTO = Partial<CreateInvoiceDTO>;

// ─── Worker ──────────────────────────────────────────────────────────────────

export interface WorkerDTO {
  id: string;
  workerId: string;
  name: string;
  phone: string;
  address: string;
  rateType: RateType;
  rate: number;
  createdAt: string;
}

export interface CreateWorkerDTO {
  name: string;
  phone: string;
  address: string;
  rateType: RateType;
  rate: number;
}

export type UpdateWorkerDTO = Partial<CreateWorkerDTO>;

// ─── Attendance ───────────────────────────────────────────────────────────────

export interface AttendanceDTO {
  id: string;
  workerId: string;
  worker?: { id: string; name: string; workerId: string };
  date: string;
  present: boolean;
  dailyPaid: number;
  createdAt: string;
}

export interface CreateAttendanceDTO {
  workerId: string;
  date: string;
  present: boolean;
  dailyPaid?: number;
}

export type UpdateAttendanceDTO = Partial<CreateAttendanceDTO>;

export interface BulkAttendanceDTO {
  date: string;
  records: { workerId: string; present: boolean; dailyPaid?: number }[];
}

// ─── Salary ───────────────────────────────────────────────────────────────────

export interface SalaryDTO {
  id: string;
  workerId: string;
  worker?: { id: string; name: string; workerId: string; rateType: RateType; rate: number };
  month: number;
  year: number;
  daysWorked: number;
  basePay: number;
  dailyPaid: number;
  bonuses: number;
  deductions: number;
  advancesTotal: number;
  netPay: number;
  generatedAt: string;
}

export interface CalculateSalaryDTO {
  workerId: string;
  month: number;
  year: number;
}

export interface SaveSalaryDTO {
  workerId: string;
  month: number;
  year: number;
  daysWorked: number;
  basePay: number;
  dailyPaid: number;
  bonuses: number;
  deductions: number;
  advancesTotal: number;
  netPay: number;
}

export type UpdateSalaryDTO = Partial<Pick<SaveSalaryDTO, 'bonuses' | 'deductions' | 'advancesTotal' | 'dailyPaid' | 'netPay'>>;

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface MonthlyRevenueVsCostDTO {
  month: string;
  revenue: number;
  cost: number;
}

export interface DashboardStatsDTO {
  activeProjects: number;
  totalClients: number;
  monthlyRevenue: number;
  outstandingBalance: number;
  lowStockCount: number;
  activeWorkers: number;
  monthlyCost: number;
  projectStatusBreakdown: {
    active: number;
    inProgress: number;
    completed: number;
    onHold: number;
  };
  revenueVsCost: MonthlyRevenueVsCostDTO[];
  recentCompletions: {
    id: string;
    title: string;
    targetType: TargetType;
    completedAt: string;
  }[];
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

// ─── API Response wrapper ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message?: string;
}
