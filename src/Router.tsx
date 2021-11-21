import { BrowserRouter, Switch, Route } from "react-router-dom";
import Coin from "./routes/Coin";
import Homecoin from "./routes/Homecoin";

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/:coinId">
          <Coin />
        </Route>
        <Route path="/">
          <Homecoin />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
export default Router;