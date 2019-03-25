// https://qiita.com/zaru/items/0ce7757c721ebd170683
export default function getOrientation(buffer: ArrayBuffer) {
  const dv = new DataView(buffer)
  let app1MarkerStart = 2
  // もし JFIF で APP0 Marker がある場合は APP1 Marker の取得位置をずらす
  if (dv.getUint16(app1MarkerStart) !== 65505) {
    const length = dv.getUint16(4)
    app1MarkerStart += length + 2
  }
  if (dv.getUint16(app1MarkerStart) !== 65505) {
    // そのまま
    return 0
  }
  // エンディアンを取得
  const littleEndian = dv.getUint8(app1MarkerStart + 10) === 73
  // フィールドの数を確認
  const count = dv.getUint16(app1MarkerStart + 18, littleEndian)
  for (let i = 0; i < count; i++) {
    const start = app1MarkerStart + 20 + i * 12
    const tag = dv.getUint16(start, littleEndian)
    // Orientation の Tag は 274
    if (tag === 274) {
      // Orientation は Type が SHORT なので 2byte だけ読む
      return dv.getUint16(start + 8, littleEndian)
    }
  }
  return 0
}
