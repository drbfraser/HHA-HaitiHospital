import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from 'contexts';
import routes from './routes';
import AppRoute from './AppRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.0/font/bootstrap-icons.css';
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
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
    </AuthProvider>
  );
};
export default App;
