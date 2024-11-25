import React, { useState } from 'react';

const SharingMenu = ({ sharingUsers, setSharingUsers }) => {
    const [email, setEmail] = useState('');
    const [permission, setPermission] = useState('전체 허용'); // 기본 권한
    const [errorMessage, setErrorMessage] = useState(''); // 이메일 유효성 에러 메시지
    const [activeDropdownIndex, setActiveDropdownIndex] = useState(null); // 드롭다운 열림 상태 관리


   // 이메일 유효성 검사
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

   // 이메일 추가
   const addUser = () => {
    if (!validateEmail(email)) {
      setErrorMessage('유효하지 않은 이메일 형식입니다.');
      return;
    }
    setErrorMessage('');
    setSharingUsers([
        ...sharingUsers,
        { email, permission: '전체 허용' }, // 기본 권한은 '전체 허용'
      ]);
          setEmail('');
  };

  const updatePermission = (index, newPermission) => {
    const updatedUsers = [...sharingUsers];
    updatedUsers[index].permission = newPermission;
    setSharingUsers(updatedUsers);
    setActiveDropdownIndex(null); // 드롭다운 닫기

  };

   // 이메일 삭제
   const removeUser = (index) => {
    const updatedUsers = sharingUsers.filter((_, i) => i !== index);
    setSharingUsers(updatedUsers);
  };


  // 드롭다운 토글
  const EditToggleDropdown = (index) => {
    setActiveDropdownIndex(activeDropdownIndex === index ? null : index);
  };

  return (
    <div className="sharing-menu-container">
    <div className="sharing-input-section">
      <input
        type="text"
        placeholder="초대하려면 이메일을 입력하세요."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="email-input"
      />
      <button onClick={addUser} className="add-user-btn">초대</button>
    </div>
    {errorMessage && <p className="error-message">{errorMessage}</p>}

    {/* <div className="sharing-permission">
      <p>이 페이지는 웹에서 누구나 볼 수 있습니다.</p>
      <select
        className="global-permission-select"
        value={permission}
        onChange={(e) => setPermission(e.target.value)}
      >
        <option value="전체 허용">전체 허용</option>
        <option value="읽기 전용">읽기 전용</option>
      </select>
    </div> */}

    <ul className="user-list">
      {sharingUsers.map((user, index) => (
        <li key={index} className="user-item">
          <img
            className="user-profile"
            src="/images/dumy-profile.png"
            alt="profile"
          />
          <span className="user-email">{user.email}</span>
          <div className="permission-dropdown">
              <button
                className="dropdown-btn"
                onClick={() => EditToggleDropdown(index)}
              >
                {user.permission} ▼
              </button>
              {activeDropdownIndex === index && (
                <ul className="dropdown-options">
                  <li
                    onClick={() => updatePermission(index, '전체 허용')}
                    className={user.permission === '전체 허용' ? 'active' : ''}
                  >
                    전체 허용
                  </li>
                  <li
                    onClick={() => updatePermission(index, '편집 허용')}
                    className={user.permission === '편집 허용' ? 'active' : ''}
                  >
                    편집 허용
                  </li>
                  <li
                    onClick={() => updatePermission(index, '댓글 허용')}
                    className={user.permission === '댓글 허용' ? 'active' : ''}
                  >
                    댓글 허용
                  </li>
                  <li
                    onClick={() => updatePermission(index, '읽기 허용')}
                    className={user.permission === '읽기 허용' ? 'active' : ''}
                  >
                    읽기 허용
                  </li>
                </ul>
              )}
            </div>

          <button
            className="remove-user-btn"
            onClick={() => removeUser(index)}
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  </div>
  );
};

export default SharingMenu;
