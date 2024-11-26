import React from "react";

export default function InviteModal_orgChart() {
  return (
    <div className="inviteLeftBox">
      <span>조직도 목록</span>

      <div className="allOrgs">
        <div className="groups">
          <img className="upDownIcon" src="../images/arrowUP.png" alt="" />
          <img className="representIcon" src="../images/group.jpg" alt="" />
          <span className="groupName selected-group">우리회사</span>
        </div>

        <div className="groups">
          <img className="upDownIcon" src="../images/arrowUP.png" alt="" />
          <img className="representIcon" src="../images/group.jpg" alt="" />
          <span className="groupName selected-group">우리회사그룹</span>
        </div>

        <div className="departments selected-dept">
          <img
            className="representIcon"
            src="../images/deptartment.jpg"
            alt=""
          />
          <span className="groupName">홍보기획실</span>
        </div>
        <div className="departments">
          <img
            className="representIcon"
            src="../images/deptartment.jpg"
            alt=""
          />
          <span className="groupName">영업팀</span>
        </div>
      </div>

      <div className="orgs-Members-List">
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
