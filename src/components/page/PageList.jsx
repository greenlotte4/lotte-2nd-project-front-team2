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

export default function PageList(){
    const [user,setUser] = useState("Jinhee Ha");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [dropdownStates, setDropdownStates] = useState({});

    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false); // State for emoji picker
    const [selectedEmoji, setSelectedEmoji] = useState("🐶"); // Default avatar emoji
  
    const toggleEmojiPicker = () => {
      setIsEmojiPickerOpen((prev) => !prev); // Toggle emoji picker
    };
  
    const handleEmojiSelect = (emoji) => {
      setSelectedEmoji(emoji); // Set selected emoji as avatar
      setIsEmojiPickerOpen(false); // Close the picker
    };
  
    const emojiList = [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "😂",
      "🤣",
      "😊",
      "😇",
      "🙂",
      "🙃",
      "😉",
      "😌",
      "😍",
      "🥰",
      "😘",
      "😗",
      "😙",
      "😚",
      "😋",
      "😜",
      "🤪",
      "😝",
      "🤑",
      "🤗",
      "🤔",
      "🤭",
    ]; // Example emoji list
  
    


    /* const [teamMembers, setTeamMembers] = useState([]);
    const [relatedProject, setRelatedProject] = useState("");

    // Example: Fetch data from your API
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Replace '/api/page-data' with your actual API endpoint
                const response = await fetch("/api/page-data");
                const data = await response.json();

                // Assume the response includes "teamMembers" and "relatedProject"
                setTeamMembers(data.teamMembers);
                setRelatedProject(data.relatedProject);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []); // Runs once on component mount */

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
          <div id='page-container1'>
            <PageAside />
            <section className='page-main1 '>
                <section className="page-main-container w-full h-full bg-white">
                    <div className='flex'>
                    <div className="main-card-avatar cursor-pointer"
                                onClick={toggleEmojiPicker} // Toggle emoji picker on click
                            >
                                {selectedEmoji}
                            </div>
                            {/* Emoji Picker */}
                            {isEmojiPickerOpen && (
                            <div className="emoji-picker">
                                <div className="emoji-grid">
                                {emojiList.map((emoji, index) => (
                                    <span
                                    key={index}
                                    className="emoji-item"
                                    onClick={() => handleEmojiSelect(emoji)}
                                    >
                                    {emoji}
                                    </span>
                                ))}
                                </div>
                            </div>
                            )}
                         <h2 className="ml-[40px] text-[40px] leading-[80px]">새 페이지 1</h2>
                    </div>
                    <div className="CardContainer scrollbar-none flex">
                    {[...Array(9)].map((_, index) => (
                        <PageCard
                            key={index}
                            isDropdownOpen={dropdownStates[index] || false}
                            toggleDropdown={() => toggleDropdown(index)}
                            teamMembers={null}
                            relatedProject={null}
                        />
                    ))}

                    </div>
                  
                </section>
                
            </section>

        </div>
        
    </>);

}