import React from "react"
import { withStyles, createStyles, Theme } from "@material-ui/core/styles"
import { Grid, Button } from "@material-ui/core"
import { Icon } from "@material-ui/core"

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
  onChangeFile: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const PreviewApplyButtons: React.FC<Props> = props => {
  const { classes, onChangeFile } = props

  return (
    <div className={classes.root}>
      <Grid container spacing={16}>
        <Grid item xs={6}>
          <Button color="primary" variant="contained" fullWidth>
            UPLOAD
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button component="label" variant="contained" fullWidth>
            <Icon>camera_alt</Icon>
            <input
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              onChange={onChangeFile}
            />
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default withStyles(styles)(PreviewApplyButtons)
