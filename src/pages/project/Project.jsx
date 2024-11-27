import { CustomSVG } from "../../components/project/CustomSVG";
import ProjectAside from "../../components/project/ProjectAside";
import { ProjectColumn } from "../../components/project/ProjectColumn";
import "@/pages/project/Project.scss";
import ShareMember from "../../components/ShareMember";

const projectColumns = [
  {
    title: "Get Started",
    color:
      "linear-gradient(0deg,rgba(245,35,75,0.40)0%,rgba(245,35,75,0.40)100%),#F5234B",
    projects: [
      {
        title: "👋 Welcome to your board 👉",
        status: "active",
        content: "Here you'll submit and manage all of your design requests.",
        priority: 4,
      },
    ],
  },
  {
    title: "🛠️ In Progress",
    color:
      "linear-gradient(0deg,rgba(0,112,245,0.40)0%,rgba(0,112,245,0.40)100%),#0070F5",
    projects: [
      {
        title: "화면구현 설계",
        content: "figma 디자인 및 구현 상태 확인",
        status: "completed",
        priority: 2,
      },
      {
        title: "화면 구현",
        content:
          "Html로 React 실행 화면 되도록이면 구현하기. 불가능할시 다음주에 더 열심히 하기",
        status: "active",
        priority: 0,
        subTasks: [
          { id: 1, isChecked: false, name: "화면 구현하기" },
          { id: 2, isChecked: true, name: "DB 설계하기" },
        ],
        checked: 1,
        tags: ["Web app", "HTML", "React"],
        duedate: "2024-11-22",
        commentsList: [
          { id: 1, user: "chhak0503", rdate: "24-11-21 17:05", content: "나 철학인데 이거 이번주까지 아니다 정신 차려라" },
          { id: 2, user: "chhak0503", rdate: "24-11-25 09:01", content: "나 철학인데 이거 이번주까지다 정신 차려라" },
        ],
      },
    ],
  },
  {
    title: "✅ Approved",
    color:
      "linear-gradient(0deg,rgba(30,195,55,0.40)0%,rgba(30,195,55,0.40)100%),#1EC337",
    projects: [
      {
        title: "Search history for Backlinks and Keywords tool",
        priority: 1,
        status: "completed",
      },
    ],
  },
];

export default function Project() {
  // Tailwind CSS 클래스 묶음
  const containerClass = "flex pb-2.5 w-full rounded-none max-md:max-w-full";
  const headerButtonClass = "flex flex-col justify-center items-end px-9 py-2 rounded-xl bg-zinc-200 max-md:pl-5";
  const addBoardClass = "flex gap-2 items-center px-3 py-2 w-full text-sm rounded-lg bg-zinc-200 bg-opacity-30";

  return (
    <div id="project-container" className="flex min-h-full">
      {/* 사이드바 */}
      <div className="w-[270px]">
        <ProjectAside />
      </div>

      {/* 메인 섹션 */}
      <section className="flex-grow py-6 pl-6 min-w-max bg-white rounded-3xl">
        
        {/* 헤더 */}
        <div className={containerClass}>
          <div className="w-[20%]"></div>
          <header className="flex overflow-hidden relative flex-col px-52 py-2.5 w-[60%]">
            <div className="flex z-0 flex-col self-center max-w-full w-[364px]">
              <button className={headerButtonClass}>
                <CustomSVG id="rename" />
              </button>
            </div>
            <h1 className="absolute top-2/4 left-2/4 z-0 h-10 text-center text-black -translate-x-2/4 -translate-y-2/4 w-[543px] max-md:max-w-full">
              <span className="text-lg">새 프로젝트 (1)</span>
            </h1>
          </header>

          {/* 네비게이션 */}
          <div className="w-[20%] flex justify-end">
            <ShareMember listName="작업자"/>
          </div>
        </div>

        {/* 프로젝트 컬럼 */}
        <div className="flex gap-5 max-md:flex-col">
          {projectColumns.map((column, index) => (
            <ProjectColumn key={index} {...column} />
          ))}
          {/* 새 보드 추가 */}
          <div className="flex flex-col w-64 text-center min-w-[240px] text-black text-opacity-50">
            <div className={addBoardClass}>
              <CustomSVG id="add" /> <span>새 보드</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
