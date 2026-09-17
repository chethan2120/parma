const UPLOAD_URL = (import.meta.env.VITE_GDRIVE_UPLOAD_URL as string | undefined)?.trim()

export function driveUploadConfigured() {
  return Boolean(UPLOAD_URL)
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function uploadFileToDrive(file: File): Promise<string | null> {
  if (!UPLOAD_URL) return null
  try {
    const base64 = await fileToBase64(file)

    // No Content-Type header → browser treats this as a "simple" cross-origin
    // POST (content-type defaults to text/plain). Simple requests don't trigger
    // a CORS preflight, and Google Apps Script automatically adds
    // Access-Control-Allow-Origin: * to responses for "Anyone" access web apps.
    const res = await fetch(UPLOAD_URL, {
      method: 'POST',
      redirect: 'follow',
      body: JSON.stringify({
        name: file.name,
        mimeType: file.type || 'application/octet-stream',
        data: base64,
      }),
    })

    const text = await res.text()

    // Try direct JSON parse first (ContentService returns clean JSON)
    try {
      const json: { success: boolean; url?: string } = JSON.parse(text)
      return json.success && json.url ? json.url : null
    } catch {
      // Fallback: extract URL from anywhere in the response text
      const urlMatch = text.match(/"url"\s*:\s*"([^"]+)"/)
      if (urlMatch?.[1]) return urlMatch[1]
      return null
    }
  } catch {
    return null
  }
}
