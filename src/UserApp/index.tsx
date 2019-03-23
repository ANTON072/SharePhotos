import React, { Fragment } from "react"
import { withStyles, createStyles, Theme } from "@material-ui/core/styles"
import { Typography, Button } from "@material-ui/core"
import Icon from "@material-ui/core/Icon"

const styles = ({ spacing }: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: "750px",
      margin: "0 auto",
      padding: `${spacing.unit * 2}px`
    }
  })

interface Props {
  classes: {
    root: string
  }
}

const UserApp: React.FC<Props> = props => {
  const { classes } = props

  return (
    <Fragment>
      <div className={classes.root}>
        <Typography component="h1" variant="headline" gutterBottom>
          Share Photos
        </Typography>
        <Button
          component="label"
          size="large"
          color="primary"
          variant="outlined"
          fullWidth
        >
          <Icon>camera_alt</Icon>
          UPLOAD PHOTOS
          <input type="file" style={{ display: "none" }} />
        </Button>
      </div>
    </Fragment>
  )
}

export default withStyles(styles)(UserApp)
