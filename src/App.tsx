import React, { Fragment } from "react"
import { CssBaseline } from "@material-ui/core"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import ViewrApp from "./ViewerApp"
import UserApp from "./UserApp"
import AdminApp from "./AdminApp"

const App: React.FC = () => {
  return (
    <Fragment>
      <CssBaseline />
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={ViewrApp} />
          <Route path="/user" exact component={UserApp} />
          <Route path="/admin" exact component={AdminApp} />
        </Switch>
      </BrowserRouter>
    </Fragment>
  )
}

export default App
