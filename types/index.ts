import { MaterialIcons } from "@expo/vector-icons";
import Decimal from "decimal.js";

export interface JwtPayload {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name: string;
  role?: string;
  iat: number;
  exp: number;
}

export interface AuthData {
  id: string;
  full_name: string;
  email: string;
  role?: string;
  token?: string;
}

export interface AuthStore {
  user: AuthData | null;
  token: string | null;
  loading: boolean;
  setUser: (data: AuthData | null) => void;
  logout: () => void;
  validateSession: () => Promise<void>;
}

export interface MemberData {
  user: {
    id: string;
    email: string;
    full_name: string;
    username: string;
    occupation: string;
    place_of_work: string;
    next_of_kin: {
      name: string;
    };
    created_at: string;
    date_of_birth: string;
    bank: {
      id: string;
      bank_name: string;
      account_name: string;
      account_number: string;
    }[];
    address: string;
    phone: string;
  };
}

export interface MemberStore {
  member: MemberData | null;
  loading: boolean;
  error: string | null;
  fetchMemberData: (memberId: string) => Promise<void>;
}

export interface RepaymentProgress {
  paid: number;
  remaining: number;
  percentage: number;
}

export interface NextPayment {
  dueDate: string;
  amount: number;
}

export interface LoanBalance {
  loanId: string;
  category: string;
  reference: string;
  originalAmount: number;
  approvedAmount: number;
  interestRate: number;
  durationMonths: number;
  totalPaid: number;
  outstandingBalance: number;
  status: string;
  startDate?: string;
  endDate?: string;
  nextPayment?: NextPayment;
  repaymentProgress: RepaymentProgress;
}

export interface LoanSummary {
  totalOutstanding: number;
  totalPaid: number;
  activeLoans: number;
  completedLoans: number;
  defaultedLoans: number;
}

export interface LoanCategory {
  categoryId: string;
  categoryName: string;
  maxAmount: number;
  collectedAmount: number;
  remainingAmount: number;
  percentageCollected: number;
}

export interface LoanBalanceState {
  loans: LoanBalance[];
  summary: LoanSummary;
  categories: LoanCategory[];
  loading: boolean;
  error: string | null;
  fetchLoanBalances: () => Promise<void>;
  getLoanById: (loanId: string) => LoanBalance | undefined;
  getCategoryById: (categoryId: string) => LoanCategory | undefined;
  getCollectedAmount: (categoryName: string) => number;
  getMaxAmount: (categoryName: string) => number;
  getRemainingAmount: (categoryName: string) => number;
  getChartData: () => {
    id: string;
    name: string;
    amount: string;
    collected: number;
    percentage: number;
  }[];
}

export interface SavingsCategoryDetail {
  categoryId: string;
  categoryName: string;
  amount: Decimal;
}

export interface SavingsBalance {
  totalSavings: number;
  monthlyDeduction: number;
  normalSavings: Decimal;
  cooperativeSavings: Decimal;
  details: SavingsCategoryDetail[];
}

export interface SavingsBalanceState {
  balance: SavingsBalance | null;
  loading: boolean;
  error: string | null;
  fetchSavingsBalance: () => Promise<void>;
  getCategoryTotal: (categoryName: string) => Decimal;
}

export interface LoanEnrollmentFlowProps {
  visible: boolean;
  onClose: () => void;
}

export interface FormData {
  servicingLoan: string;
  amount: string;
  tenure: string;
  category: string;
}

export interface UploadedFiles {
  recommendation: boolean;
  nonIndebtedness: boolean;
  application: boolean;
}

export interface WithdrawalFormData {
  amount: number;
}

export interface ForgotPasswordFormData {
  email: string;
  otp: string;
  securityAnswer: string;
  transactionPin: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordFormErrors {
  email?: string;
  otp?: string;
  securityAnswer?: string;
  transactionPin?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface ForgotPasswordFlowProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export interface LoanRecord {
  type: string;
  amount: string;
  percentage: number;
  current: string;
  total: string;
}

export interface LoanCategory {
  title: string;
  amount: string;
  status: string;
  statusColor: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  backgroundColor: string;
}

export interface CircularProgressProps {
  percentage: number;
  size?: number;
}
