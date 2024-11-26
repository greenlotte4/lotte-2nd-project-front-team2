import React from "react";

export default function InviteModal_frequent() {
  return (
    <div className="inviteLeftBox">
      <span>즐겨찾기</span>

      <div className="orgs-Members-List frequent-List">
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
  );
}
