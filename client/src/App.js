import logo from "./logo.svg";
import "./App.css";
import { Menu } from "antd";
import {
  BrowserRouter as Browser,
  Route,
  Switch,
  Link,
} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import { useMemo, useState } from "react";
import Contests from "./pages/Contests";
import NotFound from "./pages/NotFound";
function App() {
  const [admin, setAdmin] = useState();
  const [token, setToken] = useState();

  // const userValue = useMemo(() => (
  //   {user, setUser}
  // ), [setUser, user]);

  const signOut = async () => {
    // const res = await fetch("/signOut");
    // const data = await res.json();
    setAdmin(undefined);
  };

  return (
    <div className="App">
      <Browser>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">
            {!!admin ? (
              <Link to="/" onClick={signOut}>
                Cerrar Sesion
              </Link>
            ) : (
              <Link to="/">{"Login"}</Link>
            )}
          </Menu.Item>
        </Menu>
        <Switch>
          <Route
            path="/"
            exact
            component={() =>
              !admin ? (
                <Login
                  token={token}
                  setToken={setToken}
                  admin={admin}
                  setAdmin={setAdmin}
                />
              ) : (
                <PrivateRoute
                  path="/"
                  exact
                  isSignedIn={!!admin}
                  component={() => (
                    <Contests
                      admin={admin}
                      setAdmin={setAdmin}
                      token={token}
                      setToken={setToken}
                    />
                  )}
                />
              )
            }
          />
          <Route path="*" component={NotFound} />
        </Switch>
      </Browser>
    </div>
  );
}

export default App;
