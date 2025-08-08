import express from "express";
import { userRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { CourseRoutes } from "../modules/Course/course.route";
import { ModuleRoutes } from "../modules/Module/module.route";
import { StripePaymentRoutes } from "../modules/Stripe/Stripe.routes";
import { FileRoutes } from "../modules/Image/Image.routes";
import { VideoRoutes } from "../modules/Video/video.route";
import { VideoResourceRoutes } from "../modules/VideoResource/videoResource.route";
import { ReviewRoutes } from "../modules/Review/review.route";
import { ResourceRoutes } from "../modules/Resource/resource.route";
import { ContactRoutes } from "../modules/Contact/contact.route";
import path from "path";
import { StatisticsRoutes } from "../modules/Statistics/statistics.route";
import { LearningDataRoutes } from "../modules/LearningData/learningData.route";
import { IncludedRoutes } from "../modules/Included/included.route";
import { SubscriptionRoutes } from "../modules/subscription/subscription.route";
import { ProgressRoutes } from "../modules/Progress/progress.routes";
import { MyResumeRoutes } from "../modules/Resume/myResume.route";
import { successRoutes } from "../modules/Success/success.route";
import { RefundRoutes } from "../modules/Refund/refund.routes";


const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/course",
    route: CourseRoutes,
  },
  {
    path: "/module",
    route: ModuleRoutes,
  },
  {
    path: "/stripe-payments",
    route: StripePaymentRoutes,
  },
  {
    path: "/files",
    route: FileRoutes,
  },
  {
    path: "/videos",
    route: VideoRoutes,
  },
  {
    path: "/video-resources",
    route: VideoResourceRoutes,
  },
  {
    path: "/reviews",
    route: ReviewRoutes,
  },
  {
    path: "/resources",
    route: ResourceRoutes,
  },
  {
    path: "/contacts",
    route: ContactRoutes,
  },
  {
    path: "/statistics",
    route: StatisticsRoutes,
  },
  {
    path: "/learning-data",
    route: LearningDataRoutes,
  },
  {
    path: "/included",
    route: IncludedRoutes,
  },
  {
    path: "/subscription",
    route: SubscriptionRoutes,
  },
  {
    path: "/progress",
    route: ProgressRoutes,
  },
  {
    path: "/resume",
    route: MyResumeRoutes,
  },
  {
    path: "/email",
    route: successRoutes,
  },
  {
    path: "/refund-request",
    route: RefundRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
