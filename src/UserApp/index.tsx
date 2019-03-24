import React, { Fragment, useState } from "react"
import { withStyles, createStyles, Theme } from "@material-ui/core/styles"
import { Typography } from "@material-ui/core"
import UploadButton from "./UploadButton"
import Preview from "./Preview"

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

const UserApp: React.FC<Props> = props => {
  const { classes } = props

  const [loading, setLoading] = useState(false)
  const [previewSrc, setPreviewSrc] = useState<string | ArrayBuffer | null>(
    null
  )

  function handleChangeFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target || !e.target.files) {
      return
    }
    setLoading(true)
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      let result = reader.result
      // if (typeof result !== "string" || !/^data:image/.test(result)) {
      //   reader.abort()
      // }
      setPreviewSrc(result)
      setLoading(false)
    }
    reader.onerror = () => {
      reader.abort()
    }
    reader.onabort = () => {
      setLoading(false)
      console.error("ファイルの読み込みに失敗しました")
    }
    reader.readAsDataURL(file)
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
