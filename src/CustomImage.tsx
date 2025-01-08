import React, { useState, useRef, useCallback } from 'react'
import { type FC } from 'react'
import { Retool } from '@tryretool/custom-component-support'

interface ImageControlsState {
  zoom: number
  rotation: number
}

interface CustomImageComponentProps {
  imageId?: string
  imageUrl?: string
  isEditable?: boolean
  onImageUpdate?: (imageId: string, newUrl: string) => void
  uploadedImageBase64?: string
  onBase64Change?: (base64: string) => void
}

export const CustomImage: FC<CustomImageComponentProps> = ({
  imageId: propImageId,
  imageUrl: propImageUrl,
  isEditable: propIsEditable,
  onImageUpdate,
  uploadedImageBase64: propUploadedImageBase64,
  onBase64Change
}) => {
  // Retool state bindings 
  const [imageUrl, setImageUrl] = Retool.useStateString({
    name: 'imageUrl',
    initialValue: '',
    label: 'Image URL',
    description: 'URL of the image to display'
  })

  // Single state for base64 that will automatically show in the inspector
  const [uploadedImageBase64, setUploadedImageBase64] = Retool.useStateString({
    name: 'base64Value', // Changed to be more clear in the inspector
    initialValue: '',
    label: 'Image Base64',
    description: 'Base64 string of the uploaded image'
  })

  // Use either URL or base64 for display
  const displayImage = uploadedImageBase64 || imageUrl

  const [controls, setControls] = useState<ImageControlsState>({
    zoom: 1,
    rotation: 0
  })

  // Apply prop override after initialization
  React.useEffect(() => {
    if (propImageUrl) {
      setImageUrl(propImageUrl)
    }
  }, [propImageUrl, setImageUrl])

  const [isEditable, setIsEditable] = Retool.useStateBoolean({
    name: 'isEditable',
    initialValue: true,
    label: 'Enable Controls',
    description: 'Show/hide image controls'
  })

  React.useEffect(() => {
    if (propIsEditable !== undefined) {
      setIsEditable(propIsEditable)
    }
  }, [propIsEditable, setIsEditable])

  const handleZoomIn = () => {
    setControls((prev) => ({ ...prev, zoom: prev.zoom + 0.1 }))
  }

  const handleZoomOut = () => {
    setControls((prev) => ({ ...prev, zoom: Math.max(0.1, prev.zoom - 0.1) }))
  }

  const handleRotate = () => {
    setControls((prev) => ({ ...prev, rotation: (prev.rotation + 90) % 360 }))
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Add event handler for edit action

  // Add event handler for save action
  const onSave = Retool.useEventCallback({ name: 'onSave' })

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64Data = reader.result as string
        setUploadedImageBase64(base64Data)
        if (onBase64Change) {
          onBase64Change(base64Data)
        }
        setImageUrl(base64Data)
        if (onImageUpdate && propImageId) {
          onImageUpdate(propImageId, base64Data)
        }
        // Removed the onEdit trigger from here
      }
      reader.readAsDataURL(file)
    }
  }, [propImageId, onImageUpdate, setImageUrl, setUploadedImageBase64, onBase64Change])

  // Add handler for save button
  const handleSave = useCallback(() => {
    onSave()
  }, [onSave])

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // Initialize with prop value after component mounts
  React.useEffect(() => {
    if (propUploadedImageBase64) {
      setUploadedImageBase64(propUploadedImageBase64)
    }
  }, []) // Empty dependency array means this only runs once on mount

  // Keep in sync with prop changes
  React.useEffect(() => {
    if (propUploadedImageBase64) {
      setUploadedImageBase64(propUploadedImageBase64)
    }
  }, [propUploadedImageBase64, setUploadedImageBase64])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', overflow: 'hidden', margin: '20px' }}>
        <img
          src={displayImage}
          alt="Custom"
          style={{
            transform: `scale(${controls.zoom}) rotate(${controls.rotation}deg)`,
            transition: 'transform 0.2s ease-in-out',
            maxWidth: '100%',
            maxHeight: '400px'
          }}
        />
      </div>
      {isEditable && (
        <div style={{ display: 'flex', gap: '12px', padding: '10px' }}>
          <button 
            onClick={handleZoomIn}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2196F3', // Blue
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#1976D2'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#2196F3'}
          >
            <span>➕</span> Zoom In
          </button>
          <button 
            onClick={handleZoomOut}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#1976D2'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#2196F3'}
          >
            <span>➖</span> Zoom Out
          </button>
          <button 
            onClick={handleRotate}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#1976D2'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#2196F3'}
          >
            <span>🔄</span> Rotate
          </button>
          <button 
            onClick={handleUploadClick}
            style={{
              padding: '8px 16px',
              backgroundColor: '#FF9800', // Orange
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#F57C00'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#FF9800'}
          >
            <span>📤</span> Upload
          </button>
          {uploadedImageBase64 && (
            <button 
              onClick={handleSave}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4CAF50', // Green
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background-color 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#45a049'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#4CAF50'}
            >
              <span>💾</span> Save
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
      )}
    </div>
  )
} 