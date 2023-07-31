import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { AuthProvider, AdminToggleProvider } from 'contexts';

import routes from './routes';
import AppRoute from './app-route';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <AuthProvider>
        <AdminToggleProvider>
          <Router>
            <ToastContainer style={{ ['--toastify-toast-width' as any]: '35%' }} autoClose={4000} />
            <Switch>
              {routes.map((route) => (
                <AppRoute
                  key={route.path}
                  path={route.path}
                  component={route.component}
                  loginRequired={route.loginRequired}
                  rolesAllowed={route.rolesAllowed}
                  departmentsAllowed={route.departmentsAllowed}
                />
              ))}
            </Switch>
          </Router>
        </AdminToggleProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
export default App;
