'use client'

import { getFileUrl, uploadFile } from '@/lib/supabase'
import React, { useState } from 'react'


function Page() {
  const [file, setFile] = useState<File | null>(null)
  const [uploadedPath, setUploadedPath] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return
    const result = await uploadFile(file)
    if (!result) {
      console.error('上传失败',result)
      return
    }
    if (result && result.path) {
      setUploadedPath(result.path)
      setDownloadUrl(null)
    }
  }

  const handleDownload = async () => {
    if (!uploadedPath) return
    console.log('uploadedPath', uploadedPath)
    const url = await getFileUrl(uploadedPath)
    console.log('url', url)
    setDownloadUrl(url)
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file} style={{ marginLeft: 8 }}>上传</button>
      {uploadedPath && (
        <div style={{ marginTop: 16 }}>
          <div>文件名: {file?.name}</div>
          <button onClick={handleDownload} style={{ marginTop: 8 }}>下载</button>
        </div>
      )}
      {downloadUrl && (
        <div style={{ marginTop: 16 }}>
          <a href={downloadUrl} target="_blank" rel="noopener noreferrer">点击下载</a>
        </div>
      )}
    </div>
  )
}

export default Page