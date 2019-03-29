const worker: Worker = self as any

worker.addEventListener("message", async e => {
  const {
    bitmap,
    orientation
  }: {
    bitmap: ImageBitmap
    orientation: number
  } = e.data
  const imgWidth = bitmap.width
  const imgHeight = bitmap.height
  const size = { width: bitmap.width, height: bitmap.height }
  if ([5, 6, 7, 8].indexOf(orientation) > -1) {
    // 縦横逆
    size.width = bitmap.height
    size.height = bitmap.width
  }
  const canvas: OffscreenCanvas = new OffscreenCanvas(size.width, size.height)
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    worker.postMessage({ msg: "onErrorCreatedNewImage" })
    return
  }

  switch (orientation) {
    case 2: {
      ctx.transform(-1, 0, 0, 1, imgWidth, 0)
      break
    }
    case 3: {
      ctx.transform(-1, 0, 0, -1, imgWidth, imgHeight)
      break
    }
    case 4: {
      ctx.transform(1, 0, 0, -1, 0, imgHeight)
      break
    }
    case 5: {
      ctx.transform(0, 1, 1, 0, 0, 0)
      break
    }
    case 6: {
      ctx.transform(0, 1, -1, 0, imgHeight, 0)
      break
    }
    case 7: {
      ctx.transform(0, -1, -1, 0, imgHeight, imgWidth)
      break
    }
    case 8: {
      ctx.transform(0, -1, 1, 0, 0, imgWidth)
      break
    }
  }
  ctx.drawImage(bitmap, 0, 0)
  const newBlob = await canvas.convertToBlob({ type: "image/jpeg" })
  worker.postMessage({ msg: "onSuccessCreatedNewImage", blob: newBlob })
})
