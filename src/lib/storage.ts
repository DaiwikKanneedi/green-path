import { DailyActivity, getDefaultActivity } from "./eco-data";

const ACTIVITIES_KEY = "eco-activities";
const USER_KEY = "eco-user";
const THEME_KEY = "eco-theme";

export interface UserProfile {
  name: string;
  email: string;
  country: string;
  householdSize: number;
  units: "metric" | "imperial";
  joinedDate: string;
}

export function saveActivity(activity: DailyActivity) {
  const all = getAllActivities();
  const idx = all.findIndex((a) => a.date === activity.date);
  if (idx >= 0) all[idx] = activity;
  else all.push(activity);
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(all));
}

export function getAllActivities(): DailyActivity[] {
  const raw = localStorage.getItem(ACTIVITIES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getTodayActivity(): DailyActivity {
  const today = new Date().toISOString().split("T")[0];
  const all = getAllActivities();
  return all.find((a) => a.date === today) || getDefaultActivity();
}

export function saveUser(user: UserProfile) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): UserProfile | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function getTheme(): "light" | "dark" {
  return (localStorage.getItem(THEME_KEY) as "light" | "dark") || "light";
}

export function setTheme(theme: "light" | "dark") {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.classList.toggle("dark", theme === "dark");
}
