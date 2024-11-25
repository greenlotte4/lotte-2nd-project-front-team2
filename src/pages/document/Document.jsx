import React, { useState } from 'react'
import '@/pages/document/Document.scss'
import {CustomSearch} from '@/components/Search'
import { CustomButton } from '../../components/Button';
import { PieChart } from 'recharts';
import PieChartComponent from '../../components/PieChart';
import {DocumentCard1} from '../../components/document/DocumentCard1';
import { DocumentCard2 } from '../../components/document/DocumentCard2';
import MyDropzone from '../../components/DropZone';
import { Modal } from '../../components/Modal';
import { Link } from 'react-router-dom';
export default function Document() {
    const [selectOption, setSelectOption] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [folder, setFolder] = useState(false);
    const [drive, setDrive] = useState(false);
    const optionChanger = (e)=>{
        setSelectOption(Number(e.target.value))
        console.log(selectOption)
    }

    const userHandler = (e) => {

    }

    const uploadFile = () => {
        setIsOpen(true)
    }

    const onClose = () => {
        setIsOpen(false)
    }

    const folderClose = () => {
        setFolder(false)
    }

    const driveClose = () => {
        setDrive(false)
    }

    const makeFolder = () => {
        setFolder(true)
    }

    const makeDrive = () => {
        setDrive(true)
    }
    return (
        <div id='document-container1'>
            <aside className='document-aside1 overflow-scroll flex flex-col scrollbar-none'>
                <section className='flex justify-center mb-8'><p className='text-lg'>문서 (6)</p></section>
                <section className='flex justify-center mb-8 w-26'>
                    <select className='outline-none border rounded-l-md opacity-80 h-11 w-24 text-center text-sm'>
                        <option>참여자</option>
                        <option>부장</option>
                        <option>담당업무</option>
                    </select>
                    <CustomSearch
                        width1='24'
                        width2='40'
                    />
                </section>
                <section className='p-8 mb-10'>
                    <div className='flex gap-4 items-center opacity-60 mb-6'>
                        <img className='w-6 h-6' src='/images/document-star.png'></img>
                        <Link to='/document/favorite'>
                            <p>즐겨찾기</p>
                        </Link>
                    </div>
                    <div className='flex gap-4 items-center opacity-60'>
                        <img src='/images/document-recent.png'></img>
                        <p>최근문서</p>
                    </div>
                </section>
                <section className='flex justify-between items-center p-4 mb-2'>
                    <div>
                        <p className='text-2xl font-bold'>Pinned <span className='text-xs font-normal opacity-60'>(3)</span></p>
                    </div>
                    <div>
                        <img className='cursor-pointer hover:opacity-20 w-5 h-5 opacity-60' src='/images/document-minus.png'></img>
                    </div>
                </section>
                <section className='flex flex-col px-8'>
                    <div className='flex gap-4 items-center mb-1'>
                        <img src='/images/document-folder.png'></img>
                        <p className='opacity-60 pt-1'>고정 폴더 1</p>
                    </div>
                    <div className='flex gap-4 items-center mb-1'>
                        <img src='/images/document-folder.png'></img>
                        <p className='opacity-60 pt-1'>고정 폴더 2</p>
                    </div>
                    <div className='flex gap-4 items-center mb-1'>
                        <img src='/images/document-folder.png'></img>
                        <p className='opacity-60 pt-1'>고정 폴더 3</p>
                    </div>
                </section>
                <section className='flex justify-between items-center p-4 mb-2 mt-4'>
                    <div>
                        <p className='text-2xl font-bold'>Folders <span className='text-xs font-normal opacity-60'>(3)</span></p>
                    </div>
                    <div>
                        <img className='cursor-pointer hover:opacity-20 w-5 h-5 opacity-60' src='/images/document-minus.png'></img>
                    </div>
                </section>
                <section className='flex flex-col px-8'>
                    <div className='flex gap-4 items-center mb-1'>
                        <img src='/images/document-folder.png'></img>
                        <p className='opacity-60 pt-1'>새로운 폴더 1</p>
                    </div>
                    <div className='flex gap-4 items-center mb-1'>
                        <img src='/images/document-folder.png'></img>
                        <p className='opacity-60 pt-1'>새로운 폴더 2</p>
                    </div>
                    <div className='flex gap-4 items-center mb-1'>
                        <img src='/images/document-folder.png'></img>
                        <p className='opacity-60 pt-1'>새로운 폴더 3</p>
                    </div>
                </section>
                <section className='mt-auto flex flex-col gap-5'>
                    <button onClick={makeDrive} className='bg-purple white h-8 rounded-md'>드라이브 생성</button>
                </section>
            </aside>
            <section className='document-main1'>
                <section className='flex gap-4 items-center'>
                    <p className='text-2xl ml-4 mt-4'>폴더명</p><img className='w-6 h-6 mt-3' src='/images/document-pen.png'></img>
                </section>
                <section className='mt-3 text-xs opacity-40 w-full flex justify-end'>
                    <p className='mr-4'>last edited : 1 hour ago</p>
                </section>
                <img className='w-full h-1 mt-1' src='/images/document-line.png'></img>
                <section className='flex  justify-between mt-8 mb-6'>
                    <div className='flex gap-4 items-center'>
                        <CustomSearch
                            width1="20"
                            width2="60"
                        />
                        <p className='ml-4'>View :</p>
                        <img src='/images/document-note.png'></img>
                        <img src='/images/document-menu.png'></img>
                    </div>
                    <div className='flex gap-2'>
                        <button onClick={makeFolder} className='bg-purple white w-20 h-8 rounded-md text-xs'>폴더생성</button>
                        <button onClick={uploadFile} className='bg-purple white w-20 h-8 rounded-md text-xs'>파일업로드</button>
                    </div>
                </section>
                <section className='flex gap-6 ml-16 mt-12'>
                    <DocumentCard1
                        cnt ={3}
                        fileName="Contract versions"
                    />
                    <DocumentCard1
                        cnt ={3}
                        fileName="Folder2"
                    />
                    <DocumentCard1
                        cnt ={3}
                        fileName="Folder3"
                    />
                </section>
                <section className='ml-16 mt-12 inline-block'>
                    <DocumentCard2
                        fileName="fileName1kjkljk.pptx"
                    />
                    <DocumentCard2
                        fileName="fileName1kjkljk.pptx"
                    />
                    <DocumentCard2
                        fileName="fileName1kjkljk.pptx"
                    />
                    <DocumentCard2
                        fileName="fileName1kjkljk.pptx"
                    />
                    <DocumentCard2
                        fileName="fileName1kjkljk.pptx"
                    />
                    <DocumentCard2
                        fileName="fileName1kjkljk.pptx"
                    />
                    <DocumentCard2
                        fileName="fileName1kjkljk.pptx"
                    />
                    <DocumentCard2
                        fileName="fileName1kjkljk.pptx"
                    />
                    <DocumentCard2
                        fileName="fileName1kjkljk.pptx"
                    />
                    <DocumentCard2
                        fileName="fileName1kjkljk.pptx"
                    />
                    <DocumentCard2
                        fileName="fileName1kjkljk.pptx"
                    />
                    <DocumentCard2
                        fileName="fileName1kjkljk.pptx"
                    />
                    <DocumentCard2
                        fileName="fileName1kjkljk.pptx"
                    />
                </section>
                <div className='file-modal'>
                    <Modal
                        isOpen={isOpen}
                        onClose={onClose}
                        text="파일 업로드"
                    />
                </div>
                <div className='folder-modal'>
                    <Modal
                        isOpen={folder}
                        onClose={folderClose}
                        text="폴더 만들기"
                    />
                </div>
                <div className='drive-modal'>
                    <Modal
                       isOpen={drive}
                       onClose={() => setDrive(false)}
                       text="드라이브 만들기"
                    />
                </div>
            </section>

        </div>
    )
}
