import * as React from "react";

function ProjectAsideItem({ title, isActive }) {
  return (
    <div 
      className={`flex justify-between items-center px-4 py-3.5 w-full rounded-xl min-h-[50px] ${
        isActive ? 'bg-indigo-100' : 'bg-white'
      } ${isActive ? 'mt-2.5' : ''}`}
    >
      <div className="flex flex-1 shrink gap-2.5 items-center self-stretch my-auto w-full basis-0">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/785ac57889704e3a0b7af4e67c8998cefdeb2073aca5e79468706073918aefb0?placeholderIfAbsent=true&apiKey=64129ff822ae4d01a6810b1149e35589"
          className="object-contain shrink-0 self-stretch my-auto w-4 aspect-[1.14] fill-gray-600 fill-opacity-50"
          alt=""
        />
        <span className="flex-1 shrink self-stretch my-auto basis-0">
          {title}
        </span>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/5968284f52722061c07c4b925f96b3465a3bae76ee70bf4bcdb9d33f824755f9?placeholderIfAbsent=true&apiKey=64129ff822ae4d01a6810b1149e35589"
          className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
          alt=""
        />
      </div>
    </div>
  );
}

export default ProjectAsideItem;