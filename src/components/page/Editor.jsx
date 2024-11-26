import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import * as editor from "./style";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Delimiter from "./Delimiter";
import Table from "@editorjs/table";
import Paragraph from "@editorjs/paragraph";

const Editor = ({ content, setContent }) => {
  const editorInstance = useRef(null);

  useEffect(() => {
    if ( !editorInstance.current) {
      editorInstance.current = new EditorJS({
        holder: "editorjs", // 에디터를 렌더링할 DOM 요소의 ID
        tools: {
          header: {
            class: Header,
            inlineToolbar: ["link", "bold"],
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: "https://jsonplaceholder.typicode.com/posts",
                byUrl: "https://jsonplaceholder.typicode.com/posts",
              },
            },
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          table: {
            class: Table,
            inlineToolbar: true,
          },
          Delimiter: {
            class: Delimiter,
          },
        },
        data: {
          time: new Date().getTime(),
          blocks: content
            ? [
                {
                  type: "paragraph",
                  data: {
                    text: content, // 문자열을 paragraph 블록으로 변환
                  },
                },
              ]
            : [],
        },
        onChange: async () => {
          const savedData = await editorInstance.current.save();
          setContent(savedData); // 변경된 데이터를 부모 컴포넌트에 전달
        },
        placeholder: "여기에 내용을 입력하세요...",
        autofocus: true,
      });
    }

    // 컴포넌트 언마운트 시 에디터 정리
    return () => {
      if (editorInstance.current) {
        editorInstance.current.isReady
          .then(() => editorInstance.current.destroy())
          .then(() => {
            editorInstance.current = null;
          })
          .catch((err) => console.error("Editor.js cleanup failed:", err));
      }
    };
  }, [content, setContent]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const previewUrl = e.target.result;
      // 미리보기 이미지 표시
      console.log("Preview URL:", previewUrl);
    };

    reader.readAsDataURL(file);
  };

  return (
    <editor.Container>
      <div id="editorjs"></div>
    </editor.Container>
  );
};

export default Editor;



// import React, { useEffect, useRef } from "react";
// import EditorJS from '@editorjs/editorjs';
// import * as editor from "./style";
// import Header from "@editorjs/header";
// import List from "@editorjs/list";
// import ImageTool from "@editorjs/image";
// import Delimiter from "./Delimiter";
// import Table from "@editorjs/table";
// import Paragraph from "@editorjs/paragraph";



// const Editor = ({content,setContent}) => {

//   const editorInstance = useRef(null);
//     useEffect(() => {
//       if (!editorInstance.current) {
//         const editor = new EditorJS({
//           holder: 'editorjs', // 에디터를 렌더링할 DOM 요소의 ID
//           tools: {
//             header: {
//               class: Header,
//               inlineToolbar: ["link", "bold"],
//             },
//             list: {
//               class: List,
//               inlineToolbar: true,
//             },
//             image: {
//               class: ImageTool,
//               config: {
//                 endpoints: {
//                     byFile: "https://jsonplaceholder.typicode.com/posts",
//                     byUrl: "https://jsonplaceholder.typicode.com/posts",
//                 },
//               },
//             },
//             paragraph: { 
//               class: Paragraph, 
//               inlineToolbar: true 
//             },
//             table: {
//               class: Table,
//               inlineToolbar: true,
//             },
//             Delimiter:{
//               class: Delimiter,
//             }
//           },
//           data: content, // 초기 데이터로 content를 설정
//           onChange: async () => {
//             const savedData = await editorInstance.current.save();
//             setContent(savedData); // 변경된 데이터를 부모 컴포넌트에 전달
//           },
//           placeholder: '여기에 내용을 입력하세요...',
//           autofocus: true,

//         });
//       }
    

//       const observer = new MutationObserver((mutations) => {
//         mutations.forEach((mutation) => {
//           if (mutation.type === "attributes" && mutation.attributeName === "style") {
//             const target = mutation.target;
//             if (target.classList.contains("ce-toolbar")) {
//               target.style.top = "20px"; // 원하는 값으로 수정
//               target.style.left = "50px"; // 원하는 값으로 수정
//               console.log("Toolbar style updated");
//             }
//           }
//         });
//       });
      
//       const toolbar = document.querySelector(".ce-toolbar__actions");
//       if (toolbar) {
//         observer.observe(toolbar, {
//           attributes: true, // 스타일 속성 변경 감지
//         });
//       }
        
    
//          // 컴포넌트 언마운트 시 에디터 정리
//     return () => {
//       if (editorInstance.current) {
//         editorInstance.current.isReady
//           .then(() => editorInstance.current.destroy())
//           .then(() => {
//             editorInstance.current = null;
//           })
//           .catch((err) => console.error("Editor.js cleanup failed:", err));
//       }
//     };
//   }, [content, setContent]);

//       const handleFileChange = (event) => {
//         const file = event.target.files[0];
//         const reader = new FileReader();
        
//         reader.onload = (e) => {
//           const previewUrl = e.target.result;
//           // 미리보기 이미지 표시
//           console.log("Preview URL:", previewUrl);
//         };
      
//         reader.readAsDataURL(file);
//       };

    
//       return (
//         <editor.Container>
//           <div id="editorjs" ></div>
//       </editor.Container>
//     );
//   };


// export default Editor;