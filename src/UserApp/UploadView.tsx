import React, { useState, Fragment } from "react"
import { withStyles, createStyles, Theme } from "@material-ui/core/styles"
import getOrientation from "../helpers/getOrientation"
import TakePhoto from "./TakePhoto"
import PhotoLoading from "./PhotoLoading"
import PreviewApplyButtons from "./PreviewApplyButtons"
import Worker from "worker-loader!../Worker"
import Notification from "../common/Notification"
import { Variant } from "../types"

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

type uploadNotificationProps = {
  variant: Variant
  message: string
}

interface Props {
  classes: {
    root: string
    photo: string
    previewImg: string
  }
  previewSrc: string | null
  uploadLoading: boolean
  uploadNotification: boolean
  uploadNotificationMsg: uploadNotificationProps
  onSetPreviewSrc: (arg: string | null) => void
  onSetUploadLoading: (arg: boolean) => void
  onSetUploadNotification: (arg: boolean) => void
  onSetUploadNotificationMsg: (arg: uploadNotificationProps) => void
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
  const {
    classes,
    previewSrc,
    uploadLoading,
    uploadNotification,
    uploadNotificationMsg,
    onSetPreviewSrc,
    onSetUploadLoading,
    onSetUploadNotification,
    onSetUploadNotificationMsg
  } = props

  console.log("uploadLoading:", uploadLoading)

  const [mounted, setMounted] = useState(false)

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
          onSetUploadNotification(false)
          showError("ファイルの読み込みに失敗しました")
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
    onSetUploadNotificationMsg({
      variant: "error",
      message
    })
    onSetUploadNotification(true)
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
        open={uploadNotification}
        message={uploadNotificationMsg.message}
        variant={uploadNotificationMsg.variant}
        onCloseNotice={() => {
          onSetUploadNotification(false)
        }}
      />
    </Fragment>
  )
}

export default withStyles(styles)(UploadView)
