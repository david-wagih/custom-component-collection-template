import React, { useState, useRef, useCallback } from 'react'
import { type FC } from 'react'
import { Retool } from '@tryretool/custom-component-support'

interface ImageControlsState {
  zoom: number
  rotation: number
}

export const CustomImageComponent: FC = () => {
  // Retool state bindings
  const [imageUrl, setImageUrl] = Retool.useStateString({
    name: 'imageUrl',
    initialValue: '',
    label: 'Image URL',
    description: 'URL of the image to display'
  })

  const [isEditable, setIsEditable] = Retool.useStateBoolean({
    name: 'isEditable',
    initialValue: true,
    label: 'Enable Controls',
    description: 'Show/hide image controls'
  })

  // Local state for image controls
  const [controls, setControls] = useState<ImageControlsState>({
    zoom: 1,
    rotation: 0
  })

  // Event handlers
  const handleZoomIn = () => {
    setControls((prev) => ({ ...prev, zoom: prev.zoom + 0.1 }))
  }

  const handleZoomOut = () => {
    setControls((prev) => ({ ...prev, zoom: Math.max(0.1, prev.zoom - 0.1) }))
  }

  const handleRotate = () => {
    setControls((prev) => ({ ...prev, rotation: (prev.rotation + 90) % 360 }))
  }

  // Image event handlers
  const onImageLoad = Retool.useEventCallback({ name: 'onImageLoad' })
  const onImageError = Retool.useEventCallback({ name: 'onImageError' })
  const onImageClick = Retool.useEventCallback({ name: 'onImageClick' })

  const handleImageLoad = useCallback(() => {
    onImageLoad()
  }, [onImageLoad])

  const handleImageError = useCallback(() => {
    onImageError()
  }, [onImageError])

  const handleImageClick = useCallback(() => {
    onImageClick()
  }, [onImageClick])

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {/* Image container */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          margin: '20px',
          maxWidth: '100%',
          maxHeight: '500px'
        }}
      >
        <img
          src={imageUrl}
          alt="Custom component image"
          style={{
            transform: `scale(${controls.zoom}) rotate(${controls.rotation}deg)`,
            transition: 'transform 0.2s ease-in-out',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
          onClick={handleImageClick}
        />
      </div>

      {/* Controls */}
      {isEditable && (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleZoomIn} style={{ padding: '5px 10px' }}>
            Zoom In
          </button>
          <button onClick={handleZoomOut} style={{ padding: '5px 10px' }}>
            Zoom Out
          </button>
          <button onClick={handleRotate} style={{ padding: '5px 10px' }}>
            Rotate
          </button>
        </div>
      )}
    </div>
  )
}
