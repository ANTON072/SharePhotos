import React from "react"
import { withStyles, createStyles } from "@material-ui/core/styles"
import ReactLoading from "react-loading"

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
}

const PhotoLoading: React.FC<Props> = props => {
  const { classes } = props

  return (
    <div className={classes.root}>
      <ReactLoading color="#e91e63" type="spin" />
    </div>
  )
}

export default withStyles(styles)(PhotoLoading)
