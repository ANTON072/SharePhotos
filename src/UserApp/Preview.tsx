import React from "react"
import { withStyles, createStyles, Theme } from "@material-ui/core/styles"
import { Grid, Button } from "@material-ui/core"

interface Props {
  classes: {
    root: string
    wrapper: string
    wrapperInner: string
  }
  onCancel: () => void
  previewSrc: string
}

const styles = ({ spacing }: Theme) =>
  createStyles({
    root: {
      margin: `${spacing.unit * 4}px 0`
    },
    wrapper: {
      width: "100%",
      position: "relative",
      "&:before": {
        content: '""',
        display: "block",
        paddingTop: "100%"
      }
    },
    wrapperInner: {
      width: "100%",
      height: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      "& >img": {
        width: "100%",
        height: "100%",
        objectFit: "contain"
      }
    }
  })

const Preview: React.FC<Props> = props => {
  const { classes, previewSrc, onCancel } = props

  return (
    <div className={classes.root}>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <div className={classes.wrapper}>
            <div className={classes.wrapperInner}>
              {!!previewSrc && (
                <img
                  src={previewSrc}
                  onLoad={() => {
                    window.URL.revokeObjectURL(previewSrc)
                  }}
                  alt=""
                />
              )}
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <Button color="primary" variant="contained" fullWidth>
            OK
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" fullWidth onClick={onCancel}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default withStyles(styles)(Preview)
