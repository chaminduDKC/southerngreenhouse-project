export async function downloadPDF(url: string, filename: string, token: string) {
  const response = await fetch(`http://localhost:3001/api${url}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!response.ok) throw new Error('PDF generation failed')
  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = objectUrl
  a.download = filename
  a.click()
  URL.revokeObjectURL(objectUrl)
}
