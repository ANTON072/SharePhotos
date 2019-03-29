import React, { Fragment, Suspense } from "react"
import { CssBaseline } from "@material-ui/core"
import { BrowserRouter, Route, Switch } from "react-router-dom"

const ViwerApp = React.lazy(() =>
  import(/* webpackChunkName: "ViewerApp" */ "./ViewerApp")
)
const UserApp = React.lazy(() =>
  import(/* webpackChunkName: "UserApp" */ "./UserApp")
)
const AdminApp = React.lazy(() =>
  import(/* webpackChunkName: "AdminApp" */ "./AdminApp")
)

const App: React.FC = () => {
  return (
    <Fragment>
      <CssBaseline />
      <BrowserRouter>
        <Suspense fallback={<Fragment />}>
          <Switch>
            <Route path="/" exact component={ViwerApp} />
            <Route path="/user" exact component={UserApp} />
            <Route path="/admin" exact component={AdminApp} />
          </Switch>
        </Suspense>
      </BrowserRouter>
    </Fragment>
  )
}

export default App
