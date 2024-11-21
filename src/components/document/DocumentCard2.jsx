import React from 'react'
import '@/components/document/DocumentCard1.scss'

export const DocumentCard2 = ({
    fileName
}) => {
  return (
    <div className='document-card2 inline-block'>
        <div className='flex items-center justify-center mb-4'>
            <img className='mt-1 opacity-60' src='/images/document-pptx.png'></img>
        </div>
        <div className='flex flex-col justify-center items-center'>
            <p className='text-xs opacity-40'>file Name</p>
            <p className='text-xs opacity-40'>{fileName}</p>
        </div>
    </div>
  )
}
