import { Suspense, lazy } from "react";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "./routePath";

const Landing = lazy(() => import("@/pages/landing"));
const SignIn = lazy(() => import("@/pages/auth/sign-in"));
const SignUp = lazy(() => import("@/pages/auth/sign-up"));
const ForgotPassword = lazy(() => import("@/pages/auth/forgot-password"));
const ResetPassword = lazy(() => import("@/pages/auth/reset-password"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Transactions = lazy(() => import("@/pages/transactions"));
const Reports = lazy(() => import("@/pages/reports"));
const Budgets = lazy(() => import("@/pages/budgets"));
const SavingsTargets = lazy(() => import("@/pages/savings-targets"));
const Settings = lazy(() => import("@/pages/settings"));
const Account = lazy(() => import("@/pages/settings/account"));
const Appearance = lazy(() => import("@/pages/settings/appearance"));
const Billing = lazy(() => import("@/pages/settings/billing"));

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

function PageLoader() {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

export const publicRoutePaths = [
  { path: AUTH_ROUTES.LANDING, element: withSuspense(<Landing />) },
];

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGN_IN, element: withSuspense(<SignIn />) },
  { path: AUTH_ROUTES.SIGN_UP, element: withSuspense(<SignUp />) },
  { path: AUTH_ROUTES.FORGOT_PASSWORD, element: withSuspense(<ForgotPassword />) },
  { path: AUTH_ROUTES.RESET_PASSWORD, element: withSuspense(<ResetPassword />) },
];

export const protectedRoutePaths = [
  { path: PROTECTED_ROUTES.OVERVIEW, element: withSuspense(<Dashboard />) },
  { path: PROTECTED_ROUTES.TRANSACTIONS, element: withSuspense(<Transactions />) },
  { path: PROTECTED_ROUTES.REPORTS, element: withSuspense(<Reports />) },
  { path: PROTECTED_ROUTES.BUDGETS, element: withSuspense(<Budgets />) },
  { path: PROTECTED_ROUTES.SAVINGS_TARGETS, element: withSuspense(<SavingsTargets />) },
  { path: PROTECTED_ROUTES.SETTINGS,
    element: withSuspense(<Settings />) ,
    children: [
      { index: true, element: withSuspense(<Account />) },
      { path: PROTECTED_ROUTES.SETTINGS, element: withSuspense(<Account />) },
      { path: PROTECTED_ROUTES.SETTINGS_APPEARANCE, element: withSuspense(<Appearance />) },
      { path: PROTECTED_ROUTES.SETTINGS_BILLING, element: withSuspense(<Billing />) },
    ]
  },
];
