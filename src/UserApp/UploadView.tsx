import React, { useState } from "react"
import { withStyles, createStyles, Theme } from "@material-ui/core/styles"
import getOrientation from "../helpers/getOrientation"
import createTransformedCanvas from "../helpers/createTransformedCanvas"
import TakePhoto from "./TakePhoto"
import PhotoLoading from "./PhotoLoading"
import PreviewApplyButtons from "./PreviewApplyButtons"

const styles = ({ spacing, palette }: Theme) => {
  return createStyles({
    root: {
      padding: `${spacing.unit * 2}px`
    },
    photo: {
      boxSizing: "border-box",
      border: `1px solid ${palette.grey[300]}`,
      width: "100%",
      position: "relative",
      borderRadius: "10px",
      overflow: "hidden",
      "&:before": {
        content: '""',
        display: "block",
        paddingTop: "100%"
      }
    },
    previewImg: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      width: "auto",
      height: "auto",
      maxWidth: "100%",
      minWidth: "100%",
      margin: "auto"
    }
  })
}

interface Props {
  classes: {
    root: string
    photo: string
    previewImg: string
  }
}

const arrayBufferToDataURL = (arrBuf: ArrayBuffer) => {
  const blob = new Blob([arrBuf], { type: "image/jpeg" })
  return window.URL.createObjectURL(blob)
}

const UploadView: React.FC<Props> = props => {
  const { classes } = props

  const [loading, setLoading] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(false)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)

  function handleChangeFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target || !e.target.files) {
      return
    }
    setSelectedPhoto(true)
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
          const newImg = canvas.toDataURL("image/jpeg")
          setPreviewSrc(newImg)
        }
      }
    }
    reader.onerror = () => {
      reader.abort()
    }
    reader.onabort = () => {
      setLoading(false)
      setSelectedPhoto(false)
      console.error("ファイルの読み込みに失敗しました")
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <div className={classes.root}>
      <div className={classes.photo}>
        {!selectedPhoto && <TakePhoto onChangeFile={handleChangeFile} />}
        {!!previewSrc && (
          <img
            className={classes.previewImg}
            src={previewSrc}
            onLoad={() => setLoading(false)}
          />
        )}
        <PhotoLoading loading={loading} />
      </div>
      <PreviewApplyButtons />
    </div>
  )
}

export default withStyles(styles)(UploadView)
