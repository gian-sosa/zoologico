/** Renderizar píxeles en un lienzo nuevo descarta EXIF, GPS, XMP e ICC del original. */
export async function fileToCompressedWebP(file: File): Promise<Blob> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Elige una imagen JPG, PNG o WebP.')
  }
  if (file.size === 0 || file.size > 10 * 1024 * 1024) {
    throw new Error('Cada original debe pesar como máximo 10 MB.')
  }
  const bitmap = await createImageBitmap(file)
  try {
    if (bitmap.width * bitmap.height > 40_000_000) {
      throw new Error('La imagen supera el límite de 40 megapíxeles.')
    }
    const canvas = document.createElement('canvas')
    let side = 1280
    for (let attempt = 0; attempt < 4; attempt++) {
      const scale = Math.min(1, side / Math.max(bitmap.width, bitmap.height))
      canvas.width = Math.max(1, Math.round(bitmap.width * scale))
      canvas.height = Math.max(1, Math.round(bitmap.height * scale))
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('No se pudo preparar la imagen.')
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => result ? resolve(result) : reject(new Error('No se pudo comprimir la imagen.')), 'image/webp', 0.78 - attempt * 0.08)
      })
      if (blob.type !== 'image/webp') throw new Error('Este navegador no permite convertir a WebP.')
      if (blob.size <= 300 * 1024) return blob
      side = Math.round(side * 0.8)
    }
    throw new Error('La imagen no pudo reducirse a 300 KB. Prueba con otra foto.')
  } finally {
    bitmap.close()
  }
}
