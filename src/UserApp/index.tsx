import React, { Fragment } from "react"
import { withStyles, createStyles, Theme } from "@material-ui/core/styles"

const styles = ({ spacing }: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: "750px",
      margin: "0 auto",
      padding: `0 ${spacing.unit * 2}px`
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
        <h1>Hello World</h1>
      </div>
    </Fragment>
  )
}

export default withStyles(styles)(UserApp)
