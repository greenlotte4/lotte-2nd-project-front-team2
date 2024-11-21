import React from 'react'
import '@/components/document/DocumentCard1.scss'

export const DocumentCard1 = ({
    cnt,
    fileName
}) => {
  return (
    <div className='document-card1'>
      <div className='flex items-center justify-center'>
        <img className='mt-1' src='/images/document-open-folder.png'></img>
      </div>
      <div className='flex justify-center items-center'>
        <p className='opacity-40 text-xs'>{cnt} files</p>
      </div>
      <div className='flex justify-center items-center mt-2'>
        <p className='w-1/2 text-center text-blue-900 text-sm'>{fileName}</p>
      </div>
    </div>
  )
}
