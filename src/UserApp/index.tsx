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
import { Variant } from "../types"

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
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadNotificationMsg, setUploadNotificationMsg] = useState<{
    variant: Variant
    message: string
  }>({ variant: "success", message: "" })
  const [uploadNotification, setUploadNotification] = useState(false)

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
            component={() => (
              <UploadView
                previewSrc={previewSrc}
                uploadLoading={uploadLoading}
                uploadNotification={uploadNotification}
                uploadNotificationMsg={uploadNotificationMsg}
                onSetPreviewSrc={setPreviewSrc}
                onSetUploadLoading={setUploadLoading}
                onSetUploadNotification={setUploadNotification}
                onSetUploadNotificationMsg={setUploadNotificationMsg}
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
