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

    // Our Team
    route("/our-team", "routes/ourTeam/ourTeam.tsx"),
    route("/our-team/:memberid", "routes/ourTeam/teamPage.tsx"),

    route("/popular-areas", "routes/popularAreas/popularAreas.tsx"),

    route("/contact-us", "routes/contactUs.tsx"),

    // Bogs
    route("/blogs", "routes/blogs/blogs.tsx"),
    route("/blogs/:blogid", "routes/blogs/blogPage.tsx"),

    route("/career", "routes/career.tsx"),

    route("/about-us", "routes/aboutUs.tsx"),

    route("/list-with-us", "routes/listWithUs.tsx"),

    route("/real-estate-advisory", "routes/realEstateAdvisory.tsx"),
  ]),
] satisfies RouteConfig;
