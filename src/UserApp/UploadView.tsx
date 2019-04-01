import React, { useState, Fragment } from "react"
import { withStyles, createStyles, Theme } from "@material-ui/core/styles"
import getOrientation from "../helpers/getOrientation"
import TakePhoto from "./TakePhoto"
import PhotoLoading from "./PhotoLoading"
import PreviewApplyButtons from "./PreviewApplyButtons"
import Worker from "worker-loader!../Worker"
import Notification from "../common/Notification"
import { Variant } from "../types"
import { RouterProps } from "react-router"

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
      objectFit: "contain",
      width: "100%",
      height: "100%",
      position: "absolute",
      top: 0,
      left: 0
    }
  })
}

interface Props {
  classes: {
    root: string
    photo: string
    previewImg: string
  }
  uploadLoading: boolean
  onSetUploadLoading: (arg: boolean) => void
  previewSrc: string | null
  onSetPreviewSrc: (arg: string | null) => void
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

const UploadView: React.FC<Props & RouterProps> = props => {
  const {
    classes,
    uploadLoading,
    onSetUploadLoading,
    previewSrc,
    onSetPreviewSrc
  } = props

  const [mounted, setMounted] = useState(false)
  const [notification, setNotification] = useState<{
    variant: Variant
    message: string
  }>({ variant: "success", message: "" })
  const [showNotification, setShowNotification] = useState(false)

  if (!mounted) {
    worker.onmessage = e => {
      const { msg } = e.data
      switch (msg) {
        case "onSuccessCreatedNewImage": {
          const imgUrl = window.URL.createObjectURL(e.data.blob)
          onSetPreviewSrc(imgUrl)
          break
        }
        case "onErrorCreatedNewImage": {
          onSetPreviewSrc(null)
          showError("ファイルの読み込みに失敗しました")
          onSetUploadLoading(false)
          break
        }
        default: {
          break
        }
      }
    }
    setMounted(true)
  }

  function showError(message: string) {
    setNotification({
      variant: "error",
      message
    })
    setShowNotification(true)
    onSetUploadLoading(false)
  }

  function handleChangeFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target || !e.target.files) {
      return
    }
    const file = e.target.files[0]
    const reader = new FileReader()
    onSetUploadLoading(true)
    reader.onload = async () => {
      try {
        const dataUrl = await generateImg(reader)
        onSetPreviewSrc(dataUrl)
      } catch (error) {
        reader.abort()
      }
    }
    reader.onerror = () => {
      reader.abort()
    }
    reader.onabort = () => {
      showError("ファイルの読み込みに失敗しました")
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <Fragment>
      <div className={classes.root}>
        <div className={classes.photo}>
          {!!!uploadLoading && <TakePhoto onChangeFile={handleChangeFile} />}
          {!!previewSrc && (
            <img
              className={classes.previewImg}
              src={previewSrc}
              onLoad={() => {
                onSetUploadLoading(false)
              }}
            />
          )}
          {uploadLoading && <PhotoLoading />}
        </div>
        {!!previewSrc && (
          <PreviewApplyButtons onChangeFile={handleChangeFile} />
        )}
      </div>
      <Notification
        open={showNotification}
        message={notification.message}
        variant={notification.variant}
        onCloseNotice={() => {
          setShowNotification(false)
        }}
      />
    </Fragment>
  )
}

export default withStyles(styles)(UploadView)
