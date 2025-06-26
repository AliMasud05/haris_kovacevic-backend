import express from "express";
import { userRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { CourseRoutes } from "../modules/Course/course.route";
import { ModuleRoutes } from "../modules/Module/module.route";


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
    path:"/course",
    route:CourseRoutes
  },
  {
    path:"/module",
    route:ModuleRoutes
  }

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
