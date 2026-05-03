import AppRoutes from "./routes";
import { ThemeProvider } from "./context/theme-provider";
import ErrorBoundary from "./components/error-boundary";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AppRoutes />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;