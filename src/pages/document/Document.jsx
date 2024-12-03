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
import DocumentAside from '../../components/document/DocumentAside';
import DocumentLayout from '../../layout/document/DocumentLayout';
export default function Document() {
    const [selectOption, setSelectOption] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [folder, setFolder] = useState(false);
    const [drive, setDrive] = useState(false);
    const [viewType, setViewType] = useState('box'); // Default to 'box'
    const optionChanger = (e)=>{
        setSelectOption(Number(e.target.value))
        console.log(selectOption)
    }

    const viewHandler = (view) => {
        setViewType(view); // Correctly set the view type
    };

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
       <DocumentLayout>
                <section className='flex gap-4 items-center'>
                    <p className='text-2xl ml-4 mt-4'>폴더명</p><img className='w-6 h-6 mt-3' src='/images/document-pen.png'></img>
                </section>
                <section className='mt-3 text-xs opacity-40 w-full flex justify-end'>
                    <p className='mr-4'>last edited : 1 hour ago</p>
                </section>
                <img className='w-full h-1 mt-1' src='/images/document-line.png'></img>
                <section className='flex  justify-between mt-8 mb-6'>
                    <div className='flex gap-4 mx-[20px] w-[98%] items-center'>
                        <CustomSearch
                            width1="20"
                            width2="60"
                        />
                        <p className='ml-4'>View :</p>
                        <button
                            className={`list ${viewType === 'list' ? 'active' : ''}`} // Add active class for styling
                            onClick={() => viewHandler('list')}> 
                            <img src='/images/document-note.png'></img>

                            </button>
                        <button
                            className={`box ${viewType === 'box' ? 'active' : ''}`} // Add active class for styling
                            onClick={() => viewHandler('box')}>                       
                            <img src='/images/document-menu.png'></img>
                            </button>
                    </div>
                    <div className='flex gap-2'>
                        <button onClick={makeFolder} className='bg-purple white w-20 h-8 rounded-md text-xs'>폴더생성</button>
                        <button onClick={uploadFile} className='bg-purple white w-20 h-8 rounded-md text-xs'>파일업로드</button>
                    </div>
                </section>
                
                {viewType === 'box' ? ( <>
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
                    </section> </> ):( 
                        <section  className="h-[500px] overflow-scroll scrollbar-none">
                        <table className='docList mx-[20px] w-[98%] '>
                        <thead className='h-[48px] bg-[#F2F4F8] sticky top-0 z-10'>
                            <tr>
                                <th><input type="checkbox" className="checkbox text-center" /></th>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Size</th>
                                <th>Last Modified</th>
                                <th>Author</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><input type="checkbox" className="checkbox text-center" /></td>
                                <td>Contract versions</td>
                                <td>Folder</td>
                                <td>10MB</td>
                                <td>1 hour ago</td>
                                <td>Jane Doe</td>
                            </tr>
                            <tr>
                            <td><input type="checkbox" /></td>

                                <td>Folder2</td>
                                <td>Folder</td>
                                <td>10MB</td>
                                <td>1 hour ago</td>
                                <td>Jane Doe</td>
                            </tr>
                            <tr>
                            <td><input type="checkbox" /></td>

                                <td>Folder3</td>
                                <td>Folder</td>
                                <td>10MB</td>
                                <td>1 hour ago</td>
                                <td>Jane Doe</td>
                            </tr>
                            <tr>
                            <td><input type="checkbox" /></td>

                                <td>Folder3</td>
                                <td>Folder</td>
                                <td>10MB</td>
                                <td>1 hour ago</td>
                                <td>Jane Doe</td>
                            </tr>
                            <tr>
                            <td><input type="checkbox" /></td>

                                <td>Folder3</td>
                                <td>Folder</td>
                                <td>10MB</td>
                                <td>1 hour ago</td>
                                <td>Jane Doe</td>
                            </tr>
                            <tr>
                            <td><input type="checkbox" /></td>

                                <td>Folder3</td>
                                <td>Folder</td>
                                <td>10MB</td>
                                <td>1 hour ago</td>
                                <td>Jane Doe</td>
                            </tr>
                            <tr>
                            <td><input type="checkbox" /></td>

                                <td>Folder3</td>
                                <td>Folder</td>
                                <td>10MB</td>
                                <td>1 hour ago</td>
                                <td>Jane Doe</td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" /></td>

                                <td>Folder3</td>
                                <td>Folder</td>
                                <td>10MB</td>
                                <td>1 hour ago</td>
                                <td>Jane Doe</td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" /></td>

                                <td>Folder3</td>
                                <td>Folder</td>
                                <td>10MB</td>
                                <td>1 hour ago</td>
                                <td>Jane Doe</td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" /></td>

                                <td>Folder3</td>
                                <td>Folder</td>
                                <td>10MB</td>
                                <td>1 hour ago</td>
                                <td>Jane Doe</td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" /></td>

                                <td>Folder3</td>
                                <td>Folder</td>
                                <td>10MB</td>
                                <td>1 hour ago</td>
                                <td>Jane Doe</td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" /></td>

                                <td>Folder3</td>
                                <td>Folder</td>
                                <td>10MB</td>
                                <td>1 hour ago</td>
                                <td>Jane Doe</td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" /></td>

                                <td>Folder3</td>
                                <td>Folder</td>
                                <td>10MB</td>
                                <td>1 hour ago</td>
                                <td>Jane Doe</td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" /></td>

                                <td>Folder3</td>
                                <td>Folder</td>
                                <td>10MB</td>
                                <td>1 hour ago</td>
                                <td>Jane Doe</td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" /></td>

                                <td>Folder3</td>
                                <td>Folder</td>
                                <td>10MB</td>
                                <td>1 hour ago</td>
                                <td>Jane Doe</td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" /></td>

                                <td>Folder3</td>
                                <td>Folder</td>
                                <td>10MB</td>
                                <td>1 hour ago</td>
                                <td>Jane Doe</td>
                            </tr>

                        </tbody>
                        </table>
                        </section>
                        )
        }
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
               
            </DocumentLayout>
    )
}
