
export const APP_NAME = "Lite-Wiki";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  ANONYMOUS_LOGIN: "/anonymous-login", // New Route
  FORGOT_PASSWORD: "/forgot-password", 
  DASHBOARD: {
    ROOT: "/dashboard",
    WELCOME: "/dashboard/welcome", // New Route
    OVERVIEW: "/dashboard/overview",
    DOCUMENTS: "/dashboard/documents",
    COMMUNITY: "/dashboard/community",
    KNOWLEDGE: "/dashboard/knowledge",
    TEAM: "/dashboard/team",
    TEAM_FORUM: "/dashboard/team/forum",
    TEAM_WIKI: "/dashboard/team/wiki",
    TEAM_DIRECTORY: "/dashboard/team/directory",
    TEAM_MANAGEMENT: "/dashboard/team/management",
    FAVORITES: "/dashboard/favorites",
    RECENT: "/dashboard/recent",
    TRASH: "/dashboard/trash",
    PROFILE: "/dashboard/profile",
    NOTIFICATIONS: "/dashboard/notifications",
  }
};

export const MOCK_USER = {
  id: "u-123",
  name: "Alex Developer",
  email: "alex@litewiki.com",
  role: "team_leader",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
};