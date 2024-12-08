import React, { useState } from 'react'
import { type FC } from 'react'
import { Retool } from '@tryretool/custom-component-support'
import { CustomImageComponent } from './index'

// Update ImageItem to be compatible with SerializableObject
interface ImageItem {
  [key: string]: string // Add index signature
  id: string
  url: string
}

export const ImageListComponent: FC = () => {
  // Retool state bindings
  const [images, setImages] = Retool.useStateArray({
    name: 'images',
    initialValue: [] as unknown as ImageItem[], // Double type assertion to safely convert
    label: 'Image List',
    description: 'List of images to display'
  })

  const [selectedImageId, setSelectedImageId] = Retool.useStateString({
    name: 'selectedImageId',
    initialValue: '',
    label: 'Selected Image ID',
    description: 'Currently selected image ID'
  })

  const [gridColumns, setGridColumns] = Retool.useStateNumber({
    name: 'gridColumns',
    initialValue: 3,
    label: 'Grid Columns',
    description: 'Number of columns in the grid'
  })

  // Event handlers
  const onImageSelect = Retool.useEventCallback({ name: 'onImageSelect' })

  const handleImageSelect = (id: string) => {
    setSelectedImageId(id)
    onImageSelect()
  }

  // Safe type casting for images array
  const typedImages = images as unknown as ImageItem[]

  return (
    <div>
      {/* Grid container */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
          gap: '20px',
          padding: '20px'
        }}
      >
        {typedImages.map((image) => (
          <div
            key={image.id}
            style={
              {
                border:
                  selectedImageId === image.id
                    ? '2px solid #007bff'
                    : '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                transform: 'scale(1)',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              } as React.CSSProperties
            }
            onClick={() => handleImageSelect(image.id)}
          >
            <CustomImageComponent
              imageUrl={image.url}
              isEditable={selectedImageId === image.id}
            />
          </div>
        ))}
      </div>

      {/* Empty state */}
      {images.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px',
            color: '#666',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            margin: '20px'
          }}
        >
          No images to display
        </div>
      )}
    </div>
  )
}

// Export for Retool registration
export default {
  component: ImageListComponent,
  meta: {
    name: 'ImageList',
    displayName: 'Image List',
    description: 'A grid of selectable images',
    importPath: 'ImageList.tsx',
    props: {}
  }
}
