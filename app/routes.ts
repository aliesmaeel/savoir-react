import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

const maintenanceMode = process.env.MAINTENANCE_MODE === "true";

const appRoutes: RouteConfig = [
  layout("layouts/MainLayout.tsx", [
    index("routes/home.tsx"),
    route("/about", "routes/about.tsx"),
    route("/search", "routes/search.tsx"),
    route("/project/:projectSlug", "routes/project.tsx"),
    route("/off-plan", "routes/offPlanProjects.tsx"),
    route("/off-plan/:offPlanSlug", "routes/offPlan.tsx"),

    // News
    route("/news", "routes/news/news.tsx"),
    route("/news/:newsSlug", "routes/news/newsPage.tsx"),

    // Our Team
    route("/our-team", "routes/ourTeam/ourTeam.tsx"),
    route("/our-team/:teamSlug", "routes/ourTeam/teamPage.tsx"),

    route("/popular-areas/:areaSlug", "routes/popularAreas/popularAreas.tsx"),

    route("/contact-us", "routes/contactUs.tsx"),

    // Bogs
    route("/blogs", "routes/blogs/blogs.tsx"),
    route("/blogs/:blogSlug", "routes/blogs/blogPage.tsx"),

    route("/career", "routes/career.tsx"),

    route("/about-us", "routes/aboutUs.tsx"),

    route("/list-with-us", "routes/listWithUs.tsx"),

    route("/real-estate-advisory", "routes/realEstateAdvisory.tsx"),

    route("/property-management", "routes/propertyManagement.tsx"),

    route("/interior-design-services", "routes/interiorDesignServices.tsx"),

    route("/property-evaluation-services", "routes/propertyEvaluationServices.tsx"),

    route("/mortgage-services", "routes/mortgageServices.tsx"),

    route("/real-estate-guides", "routes/realEstateGuides.tsx"),

    route("/global-projects", "routes/globalProject.tsx"),

    route("/privacy-policy", "routes/privacy-policy.tsx"),
  ]),
  route("/ai-tool", "routes/ppsfTool.tsx"),
];

export default (
  maintenanceMode
    ? [
        index("routes/comingSoon.ts", { id: "comingSoonIndex" }),
        route("*", "routes/comingSoon.ts", { id: "comingSoonSplat" }),
      ]
    : appRoutes
) satisfies RouteConfig;
