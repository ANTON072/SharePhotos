import React from "react"
import { withStyles, createStyles, Theme } from "@material-ui/core/styles"
import { Snackbar, Icon } from "@material-ui/core"
import { green, amber } from "@material-ui/core/colors"
import classNames from "classnames"
import { Variant } from "../types"
import { SnackbarProps } from "@material-ui/core/Snackbar"

interface Props {
  classes: {
    success: string
    error: string
    info: string
    warning: string
    icon: string
    iconVariant: string
    message: string
    margin: string
  }
  message: string
  variant: Variant
  onCloseNotice: () => void
}

const styles = ({ spacing, palette }: Theme) => {
  return createStyles({
    success: {
      color: green[600]
    },
    error: {
      color: palette.error.dark
    },
    info: {
      color: palette.grey[50]
    },
    warning: {
      color: amber[700]
    },
    icon: {
      fontSize: 20
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: spacing.unit
    },
    message: {
      display: "flex",
      alignItems: "center",
      fontSize: "13px"
    },
    margin: {
      margin: spacing.unit
    }
  })
}

const variantIcon = {
  success: "check_circle",
  warning: "warning",
  error: "error",
  info: "info"
}

const Notification: React.FC<Props & SnackbarProps> = props => {
  const { classes, message, variant, onCloseNotice, ...other } = props

  return (
    <Snackbar
      onClick={onCloseNotice}
      className={classes.margin}
      onClose={onCloseNotice}
      autoHideDuration={5000}
      message={
        <span className={classes.message}>
          <Icon
            className={classNames(
              classes[variant],
              classes.icon,
              classes.iconVariant
            )}
          >
            {variantIcon[variant]}
          </Icon>
          {message}
        </span>
      }
      {...other}
    />
  )
}

export default withStyles(styles)(Notification)
