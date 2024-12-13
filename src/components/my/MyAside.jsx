import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function MyAside({}) {
  const params = useParams();
  const navigate = useNavigate();
  const [menuActive, setMenuActive] = useState("");
  console.log(params);

  useEffect(() => {
    if (params.page) {
      setMenuActive(params.page); // e.g., 'my' from /my or other params
    } else {
      setMenuActive("");
    }
  }, [params]);

  // console.log(params)
  // console.log(menuActive)

  return (
    <aside className="my-aside flex flex-col justify-between border">
      <div>
        <h2 className="text-xl">마이페이지</h2>
        <ul className="mt-[20px]">
          <Link to="/my">
            <li className={`flex justify-between items-center h-[50px] `}>
              <span
                className={`${
                  menuActive === "my"
                    ? "text-indigo-600 bg-indigo-500 font-bold"
                    : ""
                }`}
              >
                나의 프로필
              </span>
              <img
                className="my-menu-allow"
                src="/images/arrowRight.png"
                alt="allow"
              />
            </li>
          </Link>
          <Link to="/my/approval">
            <li className={`flex justify-between items-center h-[50px] `}>
              <span
                className={`${
                  menuActive === "approval"
                    ? "text-indigo-600 bg-indigo-500 font-bold"
                    : ""
                }`}
              >
                나의 결재현황
              </span>
              <img
                className="my-menu-allow"
                src="/images/arrowRight.png"
                alt="allow"
              />
            </li>
          </Link>
          <Link to="/my/attendance">
            <li className={`flex justify-between items-center h-[50px] `}>
              <span
                className={`${
                  menuActive === "attendance"
                    ? "text-indigo-600 bg-indigo-500 font-bold"
                    : ""
                }`}
              >
                나의 출퇴근현황
              </span>
              <img
                className="my-menu-allow"
                src="/images/arrowRight.png"
                alt="allow"
              />
            </li>
          </Link>
          <Link to="/my/payment">
            <li className={`flex justify-between items-center h-[50px] `}>
              <span
                className={`${
                  menuActive === "payment"
                    ? "text-indigo-600 bg-indigo-500 font-bold"
                    : ""
                }`}
              >
                나의 결제정보
              </span>
              <img
                className="my-menu-allow"
                src="/images/arrowRight.png"
                alt="allow"
              />
            </li>
          </Link>
        </ul>
      </div>
    </aside>
  );
}
