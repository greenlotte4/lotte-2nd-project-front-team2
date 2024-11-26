import React from "react";

export default function InviteModal_userSearch() {
  return (
    <div className="inviteLeftBox">
      <span>사용자 검색</span>

      <div className="userSearch">
        <div className="search_Input_Img">
          <input type="text" className="searchInput" />
          <img src="/images/search-icon.png" alt="" className="searchImg" />
        </div>
        <div className="orgs-Members-List searched-Members-List">
          <div className="orgs-member">
            <img className="profile" src="../images/sample_item1.jpg" alt="" />
            <div className="name_dept">
              <div className="name">전규찬</div>
              <div className="dept">
                <span>개발팀</span>
              </div>
            </div>
          </div>
          <div className="orgs-member">
            <img className="profile" src="../images/sample_item1.jpg" alt="" />
            <div className="name_dept">
              <div className="name">김규찬</div>
              <div className="dept">
                <span>인사팀</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
