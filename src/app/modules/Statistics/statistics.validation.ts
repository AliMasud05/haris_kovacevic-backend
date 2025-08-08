import { z } from "zod";

const getTopSellingCoursesValidation = z.object({
  limit: z.number().int().positive().optional(),
});

const getSalesReportValidation = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});
const getMonthlySalesValidation = z.object({
  months: z.number().int().positive().max(36).optional(), // Max 3 years back
});

export const StatisticsValidation = {
  getTopSellingCoursesValidation,
  getSalesReportValidation,
  getMonthlySalesValidation, 
};
