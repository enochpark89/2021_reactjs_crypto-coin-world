import { HashRouter, Switch, Route } from "react-router-dom";
import Coin from "./routes/Coin";
import Homecoin from "./routes/Homecoin";

function Router() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/:coinId">
          <Coin />
        </Route>
        <Route path="/">
          <Homecoin />
        </Route>
      </Switch>
    </HashRouter>
  );
}
export default Router;