import React, { Fragment, useState } from "react"
import { withStyles, createStyles, Theme } from "@material-ui/core/styles"
import { Typography, Tabs, Tab, AppBar } from "@material-ui/core"
import {
  Switch,
  Route,
  withRouter,
  RouteComponentProps
} from "react-router-dom"
import UploadView from "./UploadView"
import MyPhotosView from "./MyPhotosView"
import { RouterProps } from "react-router"

const styles = ({ spacing }: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: "750px",
      margin: "0 auto"
    },
    title: {
      padding: `${spacing.unit * 2}px`
    }
  })

interface Props extends RouteComponentProps {
  classes: {
    root: string
    title: string
  }
}

const UserApp: React.FC<Props> = props => {
  const { classes, history } = props
  const [mounted, setMounted] = useState(false)
  const [pageState, setPageState] = useState(history.location.pathname)
  const [uploadLoading, setUploadLoading] = useState(false)

  if (!mounted) {
    setMounted(true)
  }

  const handleChangeTab = (path: string) => {
    setPageState(path)
    history.push(path)
  }

  return (
    <Fragment>
      <div className={classes.root}>
        <Typography component="h1" variant="headline" className={classes.title}>
          Share Photos
        </Typography>
        <AppBar position="static">
          <Tabs value={pageState} onChange={(e, path) => handleChangeTab(path)}>
            <Tab label="Upload A Photo" value="/user" />
            <Tab label="My Photos" value="/user/photos" />
          </Tabs>
        </AppBar>
        <Switch>
          <Route
            exact
            path="/user"
            render={routerProps => (
              <UploadView
                uploadLoading={uploadLoading}
                onSetUploadLoading={setUploadLoading}
                {...routerProps}
              />
            )}
          />
          <Route exact path="/user/photos" component={MyPhotosView} />
        </Switch>
      </div>
    </Fragment>
  )
}

export default withRouter(withStyles(styles)(UserApp))
