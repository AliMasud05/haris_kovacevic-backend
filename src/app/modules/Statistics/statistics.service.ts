import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import { IMonthlyDataPoint, IMonthlyRegistrationData, IMonthlySalesData, IRecentPayment, ISalesReport, ITopSellingCourse, IUserRegistrationStats } from "./statistics.interface";
interface CourseSalesReport {
  totalCourses: number;
  uniqueEnrollments: number;
  // You can add more fields as needed
}

const getRecentPayments = async (): Promise<IRecentPayment[]> => {
  const payments = await prisma.payment.findMany({
    take: 10,
    orderBy: {
      paymentDate: "desc",
    },
    where: {
      paymentStatus: "SUCCEEDED",
    },
    include: {
      user: {
        select: {
          name: true,
          profileImage: true,
          createdAt: true,
        },
      },
      course: {
        select: {
          title: true,
        },
      },
    },
  });

  return payments.map((payment) => ({
    id: payment.id,
    amount: payment.paymentAmount,
    name: payment.user.name,
    course: payment.course.title,
    joinDate: payment.user.createdAt,
    profileImage: payment.user.profileImage ?? undefined,
    paymentDate: payment.paymentDate,
    paymentMethod: payment.paymentMethod,
    status: payment.paymentStatus,
  }));
};

const getTopSellingCourses = async (
  limit?: number
): Promise<ITopSellingCourse[]> => {
  const courses = await prisma.course.findMany({
    take: limit || 3,
    orderBy: {
      enrollments: {
        _count: "desc",
      },
    },
    include: {
      _count: {
        select: {
          enrollments: true,
        },
      },
      enrollments: {
        select: {
          Amount: true,
        },
      },
    },
  });

  return courses.map((course) => ({
    id: course.id,
    title: course.title,
    thumbnail: course.thumnail,
    totalEnrollments: course._count.enrollments,
    totalRevenue: course.enrollments.reduce(
      (sum, enrollment) => sum + enrollment.Amount,
      0
    ),
  }));
};

const getSalesReport = async (
  startDate?: string,
  endDate?: string
): Promise<ISalesReport> => {
  const whereCondition: any = {
    paymentStatus: "SUCCEEDED",
  };

  if (startDate && endDate) {
    whereCondition.paymentDate = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  const payments = await prisma.payment.findMany({
    where: whereCondition,
    include: {
      course: {
        select: {
          title: true,
        },
      },
    },
  });

  const totalRevenue = payments.reduce(
    (sum, payment) => sum + payment.paymentAmount,
    0
  );

  const paymentMethods = await prisma.payment.groupBy({
    by: ["paymentMethod"],
    where: whereCondition,
    _sum: {
      paymentAmount: true,
    },
    _count: {
      _all: true,
    },
  });

  return {
    totalSales: payments.length,
    totalRevenue,
    paymentMethods: paymentMethods.map((method) => ({
      method: method.paymentMethod,
      totalAmount: method._sum.paymentAmount || 0,
      count: method._count._all,
    })),
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
  };
};

const getMonthlySales = async (
  monthsBack?: number
): Promise<IMonthlySalesData> => {
  // Default to 12 months if not specified
  const monthsToShow = monthsBack || 12;
  
  // Calculate date range
  const currentDate = new Date();
  const startDate = new Date();
  startDate.setMonth(currentDate.getMonth() - monthsToShow + 1);
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);

  // Get current month's sales
  const currentMonthStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const currentMonthEnd = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  const currentMonthSales = await prisma.payment.aggregate({
    _sum: {
      paymentAmount: true,
    },
    _count: {
      _all: true,
    },
    where: {
      paymentStatus: "SUCCEEDED",
      paymentDate: {
        gte: currentMonthStart,
        lte: currentMonthEnd,
      },
    },
  });

  // Get historical monthly data
  const monthlyData = await prisma.$queryRaw<IMonthlyDataPoint[]>`
    SELECT
      DATE_TRUNC('month', "paymentDate")::DATE as month,
      SUM("paymentAmount") as total_sales,
      COUNT(*) as transaction_count
    FROM "Payment"
    WHERE 
      "paymentStatus" = 'SUCCEEDED' AND
      "paymentDate" >= ${startDate} AND
      "paymentDate" <= ${currentDate}
    GROUP BY DATE_TRUNC('month', "paymentDate")
    ORDER BY month ASC
  `;

  return {
    currentMonth: {
      month: currentMonthStart,
      totalSales: currentMonthSales._sum.paymentAmount || 0,
      transactionCount: currentMonthSales._count._all,
    },
    historicalData: monthlyData.map(item => ({
      month: item.month,
      totalSales: Number(item.totalSales),
      transactionCount: Number(item.transactionCount),
    })),
  };
};

const getUserRegistrationStats = async (): Promise<IUserRegistrationStats> => {
  // Get current month's registrations
  const currentDate = new Date();
  const currentMonthStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const currentMonthEnd = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  const [currentMonthRegistrations, totalRegistrations] = await Promise.all([
    prisma.user.count({
      where: {
        createdAt: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
        role: 'USER', // Only count regular users, not admins
      },
    }),
    prisma.user.count({
      where: {
        role: 'USER', // Only count regular users, not admins
      },
    }),
  ]);

  // Get monthly registration data for the last 12 months
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  const monthlyRegistrationData = await prisma.$queryRaw<IMonthlyRegistrationData[]>`
    SELECT
      DATE_TRUNC('month', "createdAt")::DATE as month,
      COUNT(*) as registrations
    FROM "Users"
    WHERE 
      "role" = 'USER' AND
      "createdAt" >= ${twelveMonthsAgo} AND
      "createdAt" <= ${currentDate}
    GROUP BY DATE_TRUNC('month', "createdAt")
    ORDER BY month ASC
  `;

  return {
    currentMonth: {
      month: currentMonthStart,
      registrations: currentMonthRegistrations,
    },
    totalRegistrations,
    monthlyTrend: monthlyRegistrationData.map(item => ({
      month: item.month,
      registrations: Number(item.registrations),
    })),
  };
};
const getCourseSalesReport = async (): Promise<any> => {
 


  const [users, totalCount] = await prisma.$transaction([
    // Query 1: Get filtered users (with enrollments)
    prisma.user.findMany({
      where: {
        enrollments: {
          some: {}, // At least one enrollment
        },
      },
      select: {
        id: true,
        name: true,
      },
    }),

    // Query 2: Get total count of users with enrollments
    prisma.user.count({
      where: {
        enrollments: {
          some: {}, // At least one enrollment
        },
      },
    }),
  ]);
  

  
  // Get total number of courses
  const totalCourses = await prisma.course.count();

  return {
    totalCourses,
    
    users,
    totalCount,
  };
};





export const StatisticsService = {
  getRecentPayments,
  getTopSellingCourses,
  getSalesReport,
  getMonthlySales,
  getUserRegistrationStats,
  getCourseSalesReport,
};