import React, { Fragment } from "react"
import { withStyles, createStyles, Theme } from "@material-ui/core/styles"
import { Typography, Tabs, Tab, AppBar } from "@material-ui/core"
import UploadView from "./UploadView"

const styles = ({ spacing }: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: "750px",
      margin: "0 auto"
    },
    title: {
      padding: `${spacing.unit * 2}px`
    }
  })

interface Props {
  classes: {
    root: string
    title: string
  }
}

const arrayBufferToDataURL = (arrBuf: ArrayBuffer) => {
  const blob = new Blob([arrBuf], { type: "image/jpeg" })
  return window.URL.createObjectURL(blob)
}

const createTransformedCanvas = (
  orientation: number,
  img: HTMLImageElement
) => {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) {
    return undefined
  }
  if ([5, 6, 7, 8].indexOf(orientation) > -1) {
    // 縦横逆
    canvas.width = img.height
    canvas.height = img.width
  } else {
    canvas.width = img.width
    canvas.height = img.height
  }
  switch (orientation) {
    case 2: {
      ctx.transform(-1, 0, 0, 1, img.width, 0)
      break
    }
    case 3: {
      ctx.transform(-1, 0, 0, -1, img.width, img.height)
      break
    }
    case 4: {
      ctx.transform(1, 0, 0, -1, 0, img.height)
      break
    }
    case 5: {
      ctx.transform(0, 1, 1, 0, 0, 0)
      break
    }
    case 6: {
      ctx.transform(0, 1, -1, 0, img.height, 0)
      break
    }
    case 7: {
      ctx.transform(0, -1, -1, 0, img.height, img.width)
      break
    }
    case 8: {
      ctx.transform(0, -1, 1, 0, 0, img.width)
      break
    }
  }
  ctx.drawImage(img, 0, 0)
  return canvas
}

const UserApp: React.FC<Props> = props => {
  const { classes } = props

  return (
    <Fragment>
      <div className={classes.root}>
        <Typography component="h1" variant="headline" className={classes.title}>
          Share Photos
        </Typography>
        <AppBar position="static">
          <Tabs value={0}>
            <Tab label="Upload A Photo" />
            <Tab label="My Photos" />
          </Tabs>
        </AppBar>
        <UploadView />
      </div>
    </Fragment>
  )
}

export default withStyles(styles)(UserApp)
