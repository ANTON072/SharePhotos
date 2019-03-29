import React from "react"
import { withStyles, createStyles, Theme } from "@material-ui/core/styles"
import { Grid, Button } from "@material-ui/core"

const styles = ({ spacing }: Theme) =>
  createStyles({
    root: {
      marginTop: `${spacing.unit * 2}px`
    }
  })

interface Props {
  classes: {
    root: string
  }
  onCancel: () => void
}

const PreviewApplyButtons: React.FC<Props> = props => {
  const { classes, onCancel } = props

  return (
    <div className={classes.root}>
      <Grid container spacing={16}>
        <Grid item xs={6}>
          <Button color="primary" variant="contained" fullWidth>
            UPLOAD
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" onClick={onCancel} fullWidth>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default withStyles(styles)(PreviewApplyButtons)
