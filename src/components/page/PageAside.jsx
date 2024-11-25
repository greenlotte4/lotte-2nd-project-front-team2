import { Link } from "react-router-dom";
import {CustomSearch} from '@/components/Search'

export default function PageAside(){

    const newPageBtnHandler = () =>{    

    }

    return(<>
        <aside className='page-aside1 overflow-scroll flex flex-col scrollbar-none'>
                <section className='flex justify-center mb-8'><p className='text-lg'>내 페이지 (6)</p></section>
                <section className='flex justify-center mb-8 w-26'>
                    <select className='outline-none border rounded-l-md opacity-80 h-11 w-24 text-center text-sm'>
                        <option>내용</option>
                        <option>제목</option>
                    </select>
                    <CustomSearch
                        width1='24'
                        width2='40'
                    />
                </section>
                <section className='py-[0px] px-[20px] mb-10'>
                    <div className='flex gap-4 items-center opacity-60 mb-6'>
                        <img className='w-6 h-6' src='/images/document-star.png'></img>
                        <Link to='/page/favorite'>
                            <p>즐겨찾기 (3)</p>
                        </Link>
                    </div>
                    <div className='flex gap-4 items-center opacity-60'>
                        <img src='/images/document-recent.png'></img>
                        <p>최근 페이지</p>
                    </div>
                </section>
                <section className='flex justify-between items-center p-4'>
                    <div>
                        <p className='text-2xl font-bold'>페이지 목록 <span className='text-xs font-normal opacity-60'>(3)</span></p>
                    </div>
                    <div>
                        <img className='cursor-pointer hover:opacity-20 w-5 h-5 opacity-60' src='/images/document-minus.png'></img>
                    </div>
                </section>
                <section className='flex flex-col px-8'>
                    <div className='flex gap-4 items-center mb-1'>
                        <img src='/images/pagesIcon.png'></img>
                         <p className='opacity-60 pt-1'>새 페이지 1</p>
                    </div>
                    <div className='flex gap-4 items-center mb-1'>
                        <img src='/images/pagesIcon.png'></img>
                        <p className='opacity-60 pt-1'>새 페이지 2</p>
                    </div>
                    <div className='flex gap-4 items-center mb-1'>
                        <img src='/images/pagesIcon.png'></img>
                        <p className='opacity-60 pt-1'>새 페이지 3</p>
                    </div>
                </section>
                <section className='flex justify-between items-center p-4 mt-4'>
                    <div>
                        <p className='text-2xl font-bold'>공유 페이지 <span className='text-xs font-normal opacity-60'>(3)</span></p>
                    </div>
                    <div>
                        <img className='cursor-pointer hover:opacity-20 w-5 h-5 opacity-60' src='/images/document-minus.png'></img>
                    </div>
                </section>
                <section className='flex flex-col px-8'>
                    <div className='flex gap-4 items-center mb-1'>
                        <img src='/images/pagesIcon.png'></img>
                        <p className='opacity-60 pt-1'>공유 폴더 1</p>
                    </div>
                    <div className='flex gap-4 items-center mb-1'>
                        <img src='/images/pagesIcon.png'></img>
                        <p className='opacity-60 pt-1'>공유 폴더 2</p>
                    </div>
                    <div className='flex gap-4 items-center mb-1'>
                        <img src='/images/pagesIcon.png'></img>
                        <p className='opacity-60 pt-1'>공유 폴더 3</p>
                    </div>
                </section>
                <section className="newPage mt-auto flex flex-col gap-5 rounded-md">
                    <Link to="/page/newPage" className="newPageBtn bg-purple white h-8 rounded-md flex justify-center text-center items-center" >
                        <img className="documentPen mr-[10px]"  src='/images/document-pen.png' />
                    새 페이지 생성</Link>
                </section>
            </aside>
    </>);
}