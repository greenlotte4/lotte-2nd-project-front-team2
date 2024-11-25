
export default function PageCard({ isDropdownOpen, toggleDropdown, teamMembers, relatedProject }){
    return(<>
    <article className="pageCard">
                        <div className="card-header">
                            <div className="card-avatar">
                            &#128054;
                            </div>
                            <div className="card-title">
                            <h3>Support Team</h3>
                            </div>
                            <div className="dropdown-toggle" onClick={toggleDropdown}>
                            <img 
                                className="menu-icon w-[17px] h-[4px]"
                                src="/images/button-dot.png"
                                alt="Options"
                            />
                            </div>
                            {isDropdownOpen && (
                            <ul className="dropdown-menu">
                                <li>즐겨찾기에 추가</li>
                                <li>휴지통으로 이동</li>
                                <li>복사하기</li>
                            </ul>
                            )}
                        </div>
                        <div className="card-content">
                            <p>
                            Support your team. The customer support team is fielding the good, the
                            bad, and the ugly day in and day out.
                            </p>
                            <div className="team-members">
                                <div className="Members flex ">
                            {teamMembers && teamMembers.length > 0 ? (
                                        teamMembers.map((member, index) => (
                                            <div className="member-container" key={index}
                                            style={{ zIndex: teamMembers.length - index }} // Ensure correct stacking
                                            >
                                                <img
                                                    src={member?.avatar || "/path/to/default-avatar.png"} // Fallback avatar
                                                    alt={member?.name || "Unknown Member"} // Fallback name
                                                    className="member-avatar"
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-members">only me</p> // Message when no members exist
                                    )}
                                    
                                   
                                    </div>
                                     {/* Display the number of team members */}
                                     {teamMembers && teamMembers.length > 0 && (
                                        <span className="member-count">+{teamMembers.length}</span>
                                    )}
                                    {relatedProject ? (
                                    <div className="badge">{relatedProject}</div>
                                ) : (
                                    <div className="badge">No Project</div> // Fallback when no related project
                                )}
                            </div>
                         </div>
                        </article>
    
    </>);
}