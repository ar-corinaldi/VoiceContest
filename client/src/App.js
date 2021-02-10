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
import { useMemo, useState, createContext } from "react";
import Contests from "./pages/Contests";
import NotFound from "./pages/NotFound";
import ContestDetail from "./pages/ContestDetail";

export const AuthContext = createContext();

function App() {
  const [admin, setAdmin] = useState();
  const [token, setToken] = useState("");

  const authentication = useMemo(() => ({ admin, setAdmin, token, setToken }), [
    setAdmin,
    admin,
    token,
    setToken,
  ]);

  const signOut = async () => {
    // const res = await fetch("/signOut");
    // const data = await res.json();
    setAdmin(undefined);
    setToken(undefined);
  };

  return (
    <div className="App">
      <Browser>
        <AuthContext.Provider value={authentication}>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">
              {!!token ? (
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
                  <Login />
                ) : (
                  <PrivateRoute
                    path="/"
                    exact
                    isSignedIn={!!admin}
                    component={() => <Contests />}
                  />
                )
              }
            />
            <PrivateRoute
              path="/:contestUrl/home"
              exact
              isSignedIn={!!admin}
              component={() => <ContestDetail />}
            />
            <Route path="*" component={NotFound} />
          </Switch>
        </AuthContext.Provider>
      </Browser>
    </div>
  );
}

export default App;
