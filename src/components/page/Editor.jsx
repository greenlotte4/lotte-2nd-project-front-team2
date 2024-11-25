import React, { useEffect } from "react";
import EditorJS from '@editorjs/editorjs';
import * as editor from "./style";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Delimiter from "./Delimiter";
import Paragraph from '@editorjs/Paragraph';


const Editor = () => {
    useEffect(() => {
        const editor = new EditorJS({
          holder: 'editorjs', // 에디터를 렌더링할 DOM 요소의 ID
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
            class: Delimiter,
          },
          placeholder: '여기에 내용을 입력하세요...',
          autofocus: true,

        });
    
        // 컴포넌트 언마운트 시 에디터 정리
        return () => {
          editor.isReady
            .then(() => editor.destroy())
            .catch((err) => console.error('Editor.js cleanup failed:', err));
        };
      }, []);
    
      return <div id="editorjs"></div>;
  };


export default Editor;