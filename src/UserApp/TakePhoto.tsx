import React from "react"
import { withStyles, createStyles } from "@material-ui/core/styles"
import { Icon } from "@material-ui/core"

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
      cursor: "pointer"
    },
    icon: {
      fontSize: "36px"
    }
  })

interface Props {
  classes: {
    root: string
    icon: string
  }
  onChangeFile: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const TakePhoto: React.FC<Props> = props => {
  const { classes, onChangeFile } = props

  return (
    <label className={classes.root}>
      <Icon className={classes.icon}>camera_alt</Icon>
      <input
        type="file"
        style={{ display: "none" }}
        accept="image/*"
        onChange={onChangeFile}
      />
    </label>
  )
}

export default withStyles(styles)(TakePhoto)
