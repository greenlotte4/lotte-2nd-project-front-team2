/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CustomSVG } from "./_CustomSVG";

export const MenuItem = ({ onClick, children, tooltip, confirm, pointColor, border, icon }) => {
  const [showTooltip, setShowTooltip] = useState(false); // 툴팁 표시 상태
  const [confirmReady, setConfirmReady] = useState(false); // 확인 준비 상태
  const [tooltipPosition, setTooltipPosition] = useState({});
  const itemRef = useRef(null);
  const tooltipTimer = useRef(null);

  const stopPropagation = (e) => e.stopPropagation();

   const handleClick = (e) => {
    stopPropagation(e);

    if (confirmReady) {
      // 두 번째 클릭: 삭제 요청
      onClick(e);
      setConfirmReady(false);
      setShowTooltip(false); // 툴팁 닫기
      clearTimeout(tooltipTimer.current);
    } else {
      // 첫 번째 클릭: 삭제 모드 활성화
      setConfirmReady(true);
      setShowTooltip(true);

      // 툴팁이 5초 후 사라지도록 설정
      tooltipTimer.current = setTimeout(() => {
        setConfirmReady(false);
        setShowTooltip(false);
      }, 5000);
    }
  };

  // 화면 다른 곳 클릭 시 초기화
  const handleOutsideClick = (event) => {
    if (itemRef.current && !itemRef.current.contains(event.target)) {
      setConfirmReady(false);
      setShowTooltip(false);
      clearTimeout(tooltipTimer.current);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // 툴팁 위치 계산
  useEffect(() => {
    if (showTooltip && itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      let top = rect.top + scrollY + 3;
      let left = rect.left + scrollX + rect.width;

      // 경계 조정
      if (left + 100 > viewportWidth) left = viewportWidth - 110;
      if (left < 10) left = 10;

      setTooltipPosition({ top, left });
    }
  }, [showTooltip]);


  return (
    <div className="relative" ref={itemRef}>
      <div
        role="menuitem"
        className={`relative flex items-center p-2 cursor-pointer text-sm text-center transition-all duration-150 overflow-hidden group
          ${border} ${
            confirmReady
              ? `text-white bg-${pointColor} font-semibold`
              : `hover:bg-gray-200`
          }`}
        onClick={confirm ? handleClick : onClick}
      >
        {/* 배경 슬라이드 효과 */}
        <span
          className={`absolute inset-0 bg-${pointColor} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
          aria-hidden="true"
        ></span>
  
        {/* 텍스트와 아이콘 */}
        <span className="relative z-10 flex items-center space-x-2 group-hover:text-white">
          {children}
          {icon ? confirmReady && <CustomSVG id={icon} color="currentColor" /> : null}
        </span>
      </div>
      {showTooltip && <Tooltip text={tooltip} position={tooltipPosition} />}
    </div>
  );
};

export const Tooltip = ({ text, position }) => {
  return createPortal(
    <div
      className="absolute px-3 py-2 text-black bg-white bg-opacity-80 rounded-md shadow-md text-xs"
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        whiteSpace: "nowrap",
        zIndex: 50,
      }}
    >
      {text}
    </div>,
    document.body
  );
};
