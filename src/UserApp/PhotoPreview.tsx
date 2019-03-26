import React from "react"
import { withStyles, createStyles, Theme } from "@material-ui/core/styles"

const styles = () =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
      position: "absolute",
      top: 0,
      left: 0
    }
  })

interface Props {
  classes: {
    root: string
  }
}

const PhotoPreview: React.FC<Props> = props => {
  const { classes } = props

  return <div className={classes.root}>photo</div>
}

export default withStyles(styles)(PhotoPreview)
