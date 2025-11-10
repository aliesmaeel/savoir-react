import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
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

    route("/global-project", "routes/globalProject.tsx"),
  ]),
] satisfies RouteConfig;
