import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { DashboardHome } from './pages/DashboardHome';
import { AppLayout } from './components/Layout/AppLayout';
import { PantryView } from './components/Pantry/PantryView';
import { RecipeGrid } from './components/Recipe/RecipeGrid';
import { MealPlanner } from './components/Planner/MealPlanner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="p-10 flex justify-center"><div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  if (!isAuthenticated) return <Navigate to="/login" />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <Toaster position="top-center" richColors />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="culinary-ui-theme">
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<DashboardHome />} />
                <Route path="/pantry" element={<PantryView />} />
                <Route path="/recipes" element={<RecipeGrid />} />
                <Route path="/planner" element={<MealPlanner />} />
              </Route>

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Router>
  );
}
