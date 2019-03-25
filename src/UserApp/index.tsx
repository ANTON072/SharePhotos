import React, { Fragment, useState } from "react"
import { withStyles, createStyles, Theme } from "@material-ui/core/styles"
import { Typography } from "@material-ui/core"
import UploadButton from "./UploadButton"
import Preview from "./Preview"
import getOrientation from "../helpers/getOrientation"

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

  const [loading, setLoading] = useState(false)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)

  function onImgLoaded() {
    if (previewSrc) {
      window.URL.revokeObjectURL(previewSrc)
      setLoading(false)
    }
  }

  function handleChangeFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target || !e.target.files) {
      return
    }
    setLoading(true)
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as ArrayBuffer
      const orientaiton = getOrientation(result)
      if (orientaiton === 0 || orientaiton === 1) {
        // 変換不要
        const data = arrayBufferToDataURL(result)
        setPreviewSrc(data)
      } else {
        const img = new Image()
        img.src = arrayBufferToDataURL(result)
        img.onload = () => {
          const canvas = createTransformedCanvas(orientaiton, img)
          if (!canvas) {
            return reader.abort()
          }
          setPreviewSrc(canvas.toDataURL("image/jpeg"))
        }
      }
    }
    reader.onerror = () => {
      reader.abort()
    }
    reader.onabort = () => {
      setLoading(false)
      console.error("ファイルの読み込みに失敗しました")
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <Fragment>
      <div className={classes.root}>
        <Typography component="h1" variant="headline" gutterBottom>
          Share Photos
        </Typography>
        {!!!previewSrc && (
          <UploadButton onChangeFile={handleChangeFile} loading={loading} />
        )}
        {!!previewSrc && (
          <Preview
            previewSrc={previewSrc}
            onImgLoaded={onImgLoaded}
            onCancel={() => {
              setPreviewSrc(null)
            }}
          />
        )}
      </div>
    </Fragment>
  )
}

export default withStyles(styles)(UserApp)
