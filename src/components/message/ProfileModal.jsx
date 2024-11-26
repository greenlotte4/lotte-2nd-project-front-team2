export default function ProfileModal({ profile, profileHandler }) {
  return (
    <div className="profile-modal">
      <div className="profile-container">
        <img src="/images/sample_item1.jpg" alt="" className="profileImg" />
        <div className="profileInfo">
          <div className="userName">
            <span>전규찬</span>
          </div>
          <div className="department">
            <span>개발팀</span>
          </div>
          <div className="email">
            <span>ian810900@gmail.com</span>
          </div>
          <div className="join_date">
            <span>2024.11.26 ~</span>
          </div>
          <div className="user_status">
            <span>재직중</span>
          </div>
        </div>
      </div>
      <img
        src="/images/closeBtn.png"
        alt=""
        className="closeBtn"
        onClick={profileHandler}
      />
    </div>
  );
}
