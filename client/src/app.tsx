import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AdminToggleProvider, AuthProvider } from 'contexts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk';

import AppRoute from './app-route';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import routes from './routes';

// Add the following code snippet to your application before any other JavaScript/TypeScript code!
// For example put the code in your root index.[ts|js] file, right before you initialize your SPA / App.

process.env.REACT_APP_FARO_URL &&
  initializeFaro({
    url:
      process.env.REACT_APP_FARO_URL,
    app: {
      name: process.env.REACT_APP_FARO_APP_NAME || 'HHA Web',
      version: process.env.REACT_APP_FARO_APP_VERSION || '0.0.0',
      environment: process.env.REACT_APP_FARO_APP_ENVIRONMENT || 'development',
    },
    instrumentations: [
      // Mandatory, overwriting the instrumentations array would cause the default instrumentations to be omitted
      ...getWebInstrumentations(),
    ],
  });

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
