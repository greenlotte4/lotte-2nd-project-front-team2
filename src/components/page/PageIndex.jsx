import React, { useState } from 'react'
import '@/pages/page/Page.scss'
import {CustomSearch} from '@/components/Search'
import {DocumentCard1} from '../../components/document/DocumentCard1';
import { DocumentCard2 } from '../../components/document/DocumentCard2';
import { Modal } from '../../components/Modal';
import { Link } from 'react-router-dom';
import PageAside from './PageAside';
import PageCard from './PageCard';
import '@/components/page/PageCardcss.scss'
import PageLayout from '../../layout/page/PageLayout';

export default function PageIndex(){
    const [user,setUser] = useState("Jinhee Ha");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [dropdownStates, setDropdownStates] = useState({});

    const teamMembers = [
        { name: 'Member 1', avatar: '/images/dumy-profile.png' },
        { name: 'Member 2', avatar: '/images/dumy-profile.png' },
        { name: 'Member 3', avatar: '/images/dumy-profile.png' },
        { name: 'Member 4', avatar: '/images/dumy-profile.png' },
        { name: 'Member 5', avatar: '/images/dumy-profile.png' },
        { name: 'Member 6', avatar: '/images/dumy-profile.png' },
    ];
    const relatedProject = 'Project1';
    
    const toggleDropdown = (index) => {
        setDropdownStates((prevStates) => ({
            ...prevStates,
            [index]: !prevStates[index], // Toggle the state of the specific card
        }));
    };

    return(<>
          <PageLayout>
                <section className="page-main-container w-full h-full bg-white">
                    <h2 className="ml-[40px] text-[40px]	">{user}&#39;s Page</h2>
                    <div className="CardContainer scrollbar-none flex">
                    {[...Array(9)].map((_, index) => (
                        <PageCard
                            key={index}
                            isDropdownOpen={dropdownStates[index] || false}
                            toggleDropdown={() => toggleDropdown(index)}
                            teamMembers={teamMembers}
                            relatedProject={relatedProject}
                        />
                    ))}

                    </div>
                  
                </section>
                
            </PageLayout>
        
    </>);

}