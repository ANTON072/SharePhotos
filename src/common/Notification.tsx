import React from "react"
import { withStyles, createStyles, Theme } from "@material-ui/core/styles"
import { SnackbarContent, IconButton, Icon } from "@material-ui/core"
import { green, amber } from "@material-ui/core/colors"
import classNames from "classnames"
import { Variant } from "../types"

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
  onClose: () => void
}

const styles = ({ spacing, palette }: Theme) => {
  return createStyles({
    success: {
      backgroundColor: green[600]
    },
    error: {
      backgroundColor: palette.error.dark
    },
    info: {
      backgroundColor: palette.primary.dark
    },
    warning: {
      backgroundColor: amber[700]
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
      fontSize: "12px"
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

const Notification: React.FC<Props> = props => {
  const { classes, message, variant, onClose } = props

  return (
    <SnackbarContent
      onClick={onClose}
      className={classNames(classes[variant], classes.margin)}
      message={
        <span className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)}>
            {variantIcon[variant]}
          </Icon>
          {message}
        </span>
      }
    />
  )
}

export default withStyles(styles)(Notification)
