import React from "react"
import { withStyles, createStyles } from "@material-ui/core/styles"
import CircularProgress from "@material-ui/core/CircularProgress"

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
      zIndex: 1,
      "&:before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(255, 255, 255, 0.5)"
      }
    }
  })

interface Props {
  classes: {
    root: string
  }
}

const PhotoLoading: React.FC<Props> = props => {
  const { classes } = props

  return (
    <div className={classes.root}>
      <CircularProgress color="secondary" />
    </div>
  )
}

export default withStyles(styles)(PhotoLoading)
