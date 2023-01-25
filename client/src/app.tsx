import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { AuthProvider } from 'contexts';
import routes from './routes';
import AppRoute from './app-route';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer style={{ width: '700px' }} />
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
