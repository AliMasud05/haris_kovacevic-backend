import { Course, Payment } from "@prisma/client";

export interface IRecentPayment {
  id: string;
  amount: number;
  name: string;
  course: string;
  joinDate: Date;
  profileImage?: string;
  paymentDate: Date;
  paymentMethod: string;
  status: string;
}

export interface ITopSellingCourse {
  id: string;
  title: string;
  thumbnail?: string;
  totalEnrollments: number;
  totalRevenue: number;
}

export interface IPaymentMethodSummary {
  method: string;
  totalAmount: number;
  count: number;
}

export interface ISalesReport {
  totalSales: number;
  totalRevenue: number;
  paymentMethods: IPaymentMethodSummary[];
  startDate?: Date;
  endDate?: Date;
}

export interface IMonthlyDataPoint {
  month: Date;
  totalSales: number;
  transactionCount: number;
}

export interface IMonthlySalesData {
  currentMonth: IMonthlyDataPoint;
  historicalData: IMonthlyDataPoint[];
}

export interface IMonthlyRegistrationData {
  month: Date;
  registrations: number;
}

export interface IUserRegistrationStats {
  currentMonth: {
    month: Date;
    registrations: number;
  };
  totalRegistrations: number;
  monthlyTrend: IMonthlyRegistrationData[];
}