import React from 'react'
import { AdminCard3 } from '../AdminCard3'
import Select from './Select'

export default function ProjectPage3({optionChanger, selectOption}) {
    const leaderDummy = {
        name : "박연화",
        messanger : "일단 더미데이터"
    }

  return (
    <>
      <section className='flex items-center gap-4 mb-12'>
                <Select
                    optionChanger={optionChanger}
                    selectOption={selectOption}
                />
                <select className='text-center opacity-80 w-24 h-10 outline-none border rounded-md'>
                    <option>업무1</option>
                    <option>업무2</option>
                    <option>업무3</option>
                </select>
                <div>7 / 11</div>
            </section>       
            <section className='flex justify-around inline-block mb-12'>
                <AdminCard3 
                clickHandler={null}
                title="담당자"
                content="이상훈, 전규찬"
                messanger={leaderDummy.messanger}
                />
                <AdminCard3 
                clickHandler={null}
                title="진행도"
                content={4/8}
                messanger={leaderDummy.messanger}
                />
                <AdminCard3 
                clickHandler={null}
                title="진행중인 업무"
                content="관리자 모달 디자인"
                messanger={leaderDummy.messanger}
                />
            </section>
            <section className='flex justify-around inline-block'>
                <AdminCard3 
                clickHandler={null}
                title="요청사항"
                content="버튼 스타일 통일 필요"
                messanger={leaderDummy.messanger}
                />
                <AdminCard3 
                clickHandler={null}
                title="요청사항"
                content="버튼 스타일 통일 필요"
                messanger={leaderDummy.messanger}
                />
            </section>  
    </>
  )
}
