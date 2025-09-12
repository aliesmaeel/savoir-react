import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("layouts/MainLayout.tsx", [
    index("routes/home.tsx"),
    route("/about", "routes/about.tsx"),
    route("/search", "routes/search.tsx"),
    route("/project/:projectid", "routes/project.tsx"),
    route("/off-plan", "routes/offPlanProjects.tsx"),
    route("/off-plan/:projectid", "routes/offPlan.tsx"),

    // News
    route("/news", "routes/news/news.tsx"),
    route("/news/:newsid", "routes/news/newsPage.tsx"),
  ]),
] satisfies RouteConfig;
