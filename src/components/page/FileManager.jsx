import React, { useState } from 'react';

const FileManager = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [fieldList, setFieldList] = useState([]); // 필드 리스트
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false); // 컨텍스트 메뉴 열림 상태
  const [renamingFieldId, setRenamingFieldId] = useState(null); // 이름 변경 중인 필드 ID
  const [selectedFieldId, setSelectedFieldId] = useState(null); // 선택된 필드 ID

  // 속성 리스트
  const propertyOptions = [
    { icon: '📄', label: '텍스트', type: 'text' },
    { icon: '#️⃣', label: '숫자', type: 'number' },
    { icon: '🔘', label: '선택', type: 'select' },
    { icon: '⭐', label: '상태', type: 'status' },
    { icon: '📅', label: '날짜', type: 'date' },
    { icon: '👤', label: '사람', type: 'person' },
    { icon: '📎', label: '파일과 미디어', type: 'file' },
    { icon: '☑️', label: '체크박스', type: 'checkbox' },
    { icon: '🔗', label: 'URL', type: 'url' },
    { icon: '✉️', label: '이메일', type: 'email' },
    { icon: '📞', label: '전화번호', type: 'phone' },
  ];


  // 드롭다운 토글 함수
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // 속성 추가 핸들러
  const addField = (option) => {
    setFieldList([
      ...fieldList,
      { id: Date.now(), name: option.label, type: option.type },
    ]);
  };

    // 필드 이름 변경 핸들러
  const updateFieldName = (id, newName) => {
    setFieldList((prev) =>
      prev.map((field) => (field.id === id ? { ...field, name: newName } : field))
    );
    setRenamingFieldId(null); // 이름 변경 모드 종료
  };

   // 키 입력 핸들러 (Enter 키로 종료)
  const handleKeyDown = (e, id, newName) => {
    if (e.key === "Enter") {
      updateFieldName(id, newName);
    }
  };
  
   // 필드 삭제 핸들러
   const removeField = (id) => {
    setFieldList((prev) => prev.filter((field) => field.id !== id));
    setIsContextMenuOpen(null); // 컨텍스트 메뉴 닫기
  };

  // 컨텍스트 메뉴 열기
  const openContextMenu = (id) => {
    setSelectedFieldId(id);
    setIsContextMenuOpen(true);
  };

  // 컨텍스트 메뉴 닫기
  const closeContextMenu = () => {
    setIsContextMenuOpen(false);
    setSelectedFieldId(null);
  };


  return (
    <div className="file-manager flex-col items-start	">
      <div className="typeList">
      {fieldList.map((field) => (
          <div key={field.id} className="field-item">
           {renamingFieldId === field.id ? (
              <input
                type="text"
                value={field.name}
                onChange={(e) => updateFieldName(field.id, e.target.value)}
                onBlur={() => updateFieldName(field.id, field.name)} // 포커스 해제 시 이름 유지
                onKeyDown={(e) => handleKeyDown(e, field.id, field.name)} // Enter 키로 종료
                autoFocus
                className="rename-input"
              />
            ) : (
              <span
                className="field-name"
                onClick={() => openContextMenu(field.id)}
              >
                {field.name}
              </span>
            )}
            <input className="field-type" type={field.type} />
            <button
              onClick={() =>
                addField(propertyOptions[Math.floor(Math.random() * propertyOptions.length)])
              }
              className="add-field-btn"
            >
              + 속성 추가
            </button>

            {isContextMenuOpen && selectedFieldId && (
                <div className="context-menu">
                  <ul>
                    <li onClick={() => setRenamingFieldId(selectedFieldId)}>이름 바꾸기</li>
                    <li>속성 편집</li>
                    <li>속성 표시 여부</li>
                    <li onClick={() => addField({ ...fieldList.find((f) => f.id === selectedFieldId) })}>
                      속성 복제
                    </li>
                    <li onClick={() => removeField(selectedFieldId)}>속성 삭제</li>
                  </ul>
                </div>
              )}
          </div>
        ))}

      </div>

      {/* 속성 추가 버튼 */}
      <button onClick={toggleDropdown} className="add-property-btn">
        + 속성 추가
      </button>

       {/* 드롭다운 */}
       {isDropdownOpen && (
        <div className="property-dropdown">
          <ul className="property-list">
            {propertyOptions.map((option, index) => (
              <li
              key={index}
              className="property-item"
              onClick={() => addField(option)}
               >
                <span className="property-icon">{option.icon}</span>
                <span className="property-label">{option.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileManager;