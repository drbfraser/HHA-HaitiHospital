import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import { AdminToggleProvider, AuthProvider } from 'contexts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import AppRoute from './app-route';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import routes from './routes';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <AuthProvider>
        <AdminToggleProvider>
          <Router>
            <ToastContainer style={{ ['--toastify-toast-width' as any]: '35%' }} />
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
