import React from "react"
import { withStyles, createStyles } from "@material-ui/core/styles"
import { CircularProgress } from "@material-ui/core"

const styles = () =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#fff"
    }
  })

interface Props {
  classes: {
    root: string
  }
  loading: boolean
}

const PhotoLoading: React.FC<Props> = props => {
  const { classes, loading } = props

  if (!loading) {
    return <React.Fragment />
  }
  return (
    <div className={classes.root}>
      <CircularProgress color="secondary" />
    </div>
  )
}

export default withStyles(styles)(PhotoLoading)
