import React from 'react'
import { useSelector } from 'react-redux';

export default function AdminHeader() {
    const selectedTeamId = useSelector((state) => state.team.selectedTeamId);
  return (
    <section className='flex mb-[100px]'>
        <p className='flex items-center justify-center w-80 rounded-md font-bold text-[40px] mx-auto'>{selectedTeamId}</p>
        <div className="flex"> 
            <img src='/images/dumy-profile.png' className="w-1/3" />
            <img src='/images/dumy-profile.png' className="w-1/3" />
            <img src='/images/dumy-profile.png' className="w-1/3" />
            <img src='/images/dumy-profile.png' className="w-1/3" />
        </div>
    </section>
  )
}
