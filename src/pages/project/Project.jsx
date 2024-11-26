import { CustomSVG } from "../../components/project/CustomSVG";
import ProjectAside from "../../components/project/ProjectAside";
import { ProjectColumn } from "../../components/project/ProjectColumn";
import "@/pages/project/Project.scss";

const projectColumns = [
  {
    title: "Get Started",
    count: 4,
    color:
      "bg-[linear-gradient(0deg,rgba(245,35,75,0.40_0%,rgba(245,35,75,0.40)_100%),#F5234B)]",
    projects: [
      {
        title: "👋 Welcome to your board 👉",
        status: "active",
        content: "Here you'll submit and manage all of your design requests.",
      },
    ],
  },
  {
    title: "🛠️ In Progress",
    count: 1,
    color:
      "bg-[linear-gradient(0deg,rgba(0,112,245,0.40_0%,rgba(0,112,245,0.40)_100%),#0070F5)]",
    projects: [
      {
        title: "화면구현 설계",
        content: "figma 디자인 및 구현 상태 확인",
        status: "active",
        stats: [
          { icon: "􀋳", value: "0/1" },
          { icon: "􀉉", value: "Tomorrow" },
          { icon: "􂄹", value: "1" },
        ],
      },
      {
        title: "화면 구현",
        content:
          "Html로 React 실행 화면 되도록이면 구현하기. 불가능할시 다음주에 더 열심히 하기",
        status: "active",
        priority: 2,
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
    count: 17,
    color:
      "bg-[linear-gradient(0deg,rgba(30,195,55,0.40_0%,rgba(30,195,55,0.40)_100%),#1EC337)]",
    projects: [
      {
        title: "Search history for Backlinks and Keywords tool",
        priority: 1,
        status: "completed",
        stats: [{ icon: "􀋳", value: "2/2" }],
      },
    ],
  },
];

export default function Project() {
  // Tailwind CSS 클래스 묶음
  const containerClass = "flex flex-col pb-2.5 w-full rounded-none max-md:max-w-full";
  const headerButtonClass = "flex flex-col justify-center items-end px-9 py-2 rounded-xl bg-slate-100 max-md:pl-5";
  const navButtonClass =
    "flex gap-2.5 justify-center items-center px-2 w-10 h-10 bg-white border-2 border-gray-100 border-dashed min-h-[40px] rounded-[48px]";
  const addBoardClass = "flex gap-2 items-center px-3 py-2 w-full text-sm rounded-lg bg-zinc-200 bg-opacity-30";

  return (
    <div id="project-container" className="flex gap-[20px] min-h-full">
      {/* 사이드바 */}
      <div className="w-[270px]">
        <ProjectAside />
      </div>

      {/* 메인 섹션 */}
      <section className="flex-grow py-8 pl-6 min-w-max bg-white rounded-3xl">
        {/* 헤더 */}
        <div className={containerClass}>
          <header className="flex overflow-hidden relative flex-col px-52 py-2.5 max-md:px-5 max-md:max-w-full">
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
          <nav className="flex z-10 gap-2 items-start self-end mt-0 rounded-3xl max-md:mr-2">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/694a234b9cbe08c418c3e7a547979eeab73ed28f27d07b54bb0d47d659419974?placeholderIfAbsent=true&apiKey=64129ff822ae4d01a6810b1149e35589"
              className="object-contain shrink-0 rounded-xl aspect-[3.4] w-[136px]"
              alt="Board navigation"
            />
            <button className={navButtonClass}>
              <CustomSVG id="group-add" />
            </button>
          </nav>
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
