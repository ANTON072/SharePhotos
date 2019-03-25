export default function createTransformedCanvas(
  orientation: number,
  img: HTMLImageElement
) {
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
