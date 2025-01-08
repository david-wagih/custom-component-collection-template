import React, { useState } from 'react'
import { type FC } from 'react'

interface ImageItem {
  [key: string]: string | number
  id: string
  url: string
}

interface ImageListProps {
  images?: ImageItem[]
  gridColumns?: number
}

export const CustomImageList: FC<ImageListProps> = ({ images = [], gridColumns = 3 }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
    gap: '16px',
    padding: '16px'
  }

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'transform 0.2s'
  }

  const handleImageClick = (imageId: string) => {
    setSelectedImage(imageId)
  }

  return (
    <div style={gridStyle}>
      {images.map((image) => (
        <img
          key={image.id}
          src={image.url}
          alt={`Image ${image.id}`}
          style={{
            ...imageStyle,
            transform: selectedImage === image.id ? 'scale(1.05)' : 'scale(1)'
          }}
          onClick={() => handleImageClick(image.id)}
        />
      ))}
    </div>
  )
} 