import React from "react"
import { withStyles, createStyles, Theme } from "@material-ui/core/styles"
import { Button } from "@material-ui/core"
import Icon from "@material-ui/core/Icon"

const styles = ({ spacing }: Theme) =>
  createStyles({
    root: {
      margin: `${spacing.unit * 4}px 0`
    },
    icon: {
      margin: `0 ${spacing.unit}px`
    }
  })

interface Props {
  classes: {
    root: string
    icon: string
  }
  loading: boolean
  onChangeFile: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const UploadButton: React.FC<Props> = props => {
  const { classes, onChangeFile, loading } = props

  return (
    <div className={classes.root}>
      <Button
        component="label"
        size="large"
        color="primary"
        variant="outlined"
        fullWidth
        disabled={loading}
      >
        <Icon className={classes.icon}>camera_alt</Icon>
        UPLOAD PHOTOS
        <input
          type="file"
          style={{ display: "none" }}
          accept="image/*"
          onChange={onChangeFile}
        />
      </Button>
    </div>
  )
}

export default withStyles(styles)(UploadButton)
