import React, { useState } from "react"
import { withStyles, createStyles, Theme } from "@material-ui/core/styles"
import getOrientation from "../helpers/getOrientation"
import TakePhoto from "./TakePhoto"
import PhotoLoading from "./PhotoLoading"
import PreviewApplyButtons from "./PreviewApplyButtons"
import Worker from "worker-loader!../Worker"

const worker = new Worker()

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

const generateImg = (reader: FileReader) => {
  return new Promise<string>(async (resolve, reject) => {
    const result = reader.result as ArrayBuffer
    const orientation = getOrientation(result) as number
    const dataUrl = arrayBufferToDataURL(result)
    if (orientation === 0 || orientation === 1) {
      // 変換不要
      resolve(dataUrl)
    } else {
      const blob = new Blob([result], { type: "image/jpeg" })
      const bitmap = await window.createImageBitmap(blob)
      worker.postMessage(
        {
          bitmap,
          orientation
        },
        [bitmap]
      )
    }
  })
}

const UploadView: React.FC<Props> = props => {
  const { classes } = props

  const [loading, setLoading] = useState(false)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  if (!mounted) {
    worker.onmessage = e => {
      const imgUrl = window.URL.createObjectURL(e.data.blob)
      setPreviewSrc(imgUrl)
    }
    setMounted(true)
  }

  function handleChangeFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target || !e.target.files) {
      return
    }
    const file = e.target.files[0]
    const reader = new FileReader()
    setLoading(true)
    reader.onload = async () => {
      try {
        const dataUrl = await generateImg(reader)
        setPreviewSrc(dataUrl)
      } catch (error) {
        reader.abort()
      }
    }
    reader.onerror = () => {
      reader.abort()
    }
    reader.onabort = () => {
      console.error("ファイルの読み込みに失敗しました")
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <div className={classes.root}>
      <div className={classes.photo}>
        {!!!previewSrc && <TakePhoto onChangeFile={handleChangeFile} />}
        {!!previewSrc && (
          <img
            className={classes.previewImg}
            src={previewSrc}
            onLoad={() => {
              setLoading(false)
            }}
          />
        )}
        {loading && <PhotoLoading />}
      </div>
      {!!previewSrc && (
        <PreviewApplyButtons
          onCancel={() => {
            setPreviewSrc(null)
          }}
        />
      )}
    </div>
  )
}

export default withStyles(styles)(UploadView)
