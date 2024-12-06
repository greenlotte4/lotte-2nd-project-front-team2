import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Table from "@editorjs/table";
import Paragraph from "@editorjs/paragraph";
import Delimiter from "./Delimiter";
import styled from "styled-components";
import axiosInstance from "../../services/axios";
import useUserStore from "../../store/useUserStore";

// 스타일 정의
const EditorContainer = styled.div`
  width: 100%;
  max-width: 1440px;
  // margin: 0 auto;
  padding: 20px;
`;

const Editor = ({  itle, content, setContent,onSave }) => {
  const editorInstance = useRef(null);
  const saveTimeout = useRef(null);
  const [currentPageId, setCurrentPageId] = useState(null);


  // const saveContent = async ({title,editorInstance}) => {
  //   if (!editorInstance.current) return;

  //   try {
  //     const savedData = await editorInstance.current.save();
      
  //     const fullData = {
  //       id: pageId,
  //       title: title,
  //       content: JSON.stringify(savedData), // 에디터 데이터를 문자열로 변환
  //       ownerUid: user.uid,
  //       permissions: permissions || 'FULL'
  //     };

  //     console.log('Saving content to server:', fullData);
      
  //     const response = await axiosInstance.post("/api/page/save", fullData);
      
  //     if (response.data && response.data.id) {
  //       if (!pageId) {
  //         setCurrentPageId(response.data.id);
  //       }
  //       setContent(savedData); // 부모 컴포넌트의 content 상태 업데이트
  //       console.log("Save successful:", response.data);
  //     }

  //     return savedData;
  //   } catch (error) {
  //     console.error("Error while saving content:", error);
  //   }
  // };
  useEffect(() => {
    if (!editorInstance.current) {
      try {
        editorInstance.current = new EditorJS({
          holder: "editorjs",
          tools: {
            header: { class: Header, inlineToolbar: ["link", "bold"] },
            list: { class: List, inlineToolbar: true },
            image: { class: ImageTool },
            paragraph: { class: Paragraph, inlineToolbar: true },
            table: { class: Table, inlineToolbar: true },
            delimiter: Delimiter,
          },
          data: content || { blocks: [] }, // 초기 데이터
          placeholder: "여기에 내용을 입력하세요...",
          autofocus: true,
          onChange: () => {
            clearTimeout(saveTimeout.current); // 이전 타이머를 초기화
            saveTimeout.current = setTimeout(async () => {
              try {
                const savedData = await editorInstance.current.save();
                setContent(savedData); // 부모 상태 업데이트
                if (onSave) onSave(); // 저장 함수 호출
              } catch (error) {
                console.error("Error while saving editor content:", error);
              }
            }, 3000); // 1초 후에 저장 요청
          },
        });
      } catch (error) {
        console.error("Error initializing EditorJS:", error);
      }
    }
  
    return () => {
          if (editorInstance.current) {
             editorInstance.current.save().then(outputData => {
              setContent(outputData);// 언마운트 시 마지막으로 저장
              onSave(); // Trigger save if provided

            });
            editorInstance.current.destroy();
            editorInstance.current = null;
          }
          clearTimeout(saveTimeout.current);
        };
  }, []);
  
  useEffect(() => {
    if (editorInstance.current && content) {
      try {
        editorInstance.current.isReady
        .then(() => {
            editorInstance.current.render(content); // Only render if EditorJS is ready
        })
        .catch((err) => {
            console.error("EditorJS is not ready:", err);
        });
      } catch (error) {
        console.error("Error while rendering content in EditorJS:", error);
      }
    }
  }, [content]);

  // 에디터 초기화
  // useEffect(() => {
  //   if (!editorInstance.current) {
  //     try{
  //       editorInstance.current = new EditorJS({
  //         holder: "editorjs",
  //         tools: {
  //           header: { class: Header, inlineToolbar: ["link", "bold"] },
  //           list: { class: List, inlineToolbar: true },
  //           image: {
  //             class: ImageTool,
  //             config: {
  //               endpoints: {
  //                 byFile: "/uploadFile",
  //                 byUrl: "/fetchUrl",
  //               },
  //             },
  //           },
  //           paragraph: { class: Paragraph, inlineToolbar: true },
  //           table: { class: Table, inlineToolbar: true },
  //           delimiter: Delimiter,
  //         },
  //         data: content || { blocks: [] },
  //         placeholder: "여기에 내용을 입력하세요...",
  //         autofocus: true,
  //         onChange: async () => {
  //           try {
  //               const savedData = await editorInstance.current.save();
  //               editorInstance.current.render(savedData); // 새로운 데이터를 에디터에 반영
  //               setContent(savedData); // 부모 상태 업데이트
  //               saveContent();
  //           } catch (error) {
  //               console.error("Error while saving editor content:", error);
  //           }
  //       },
        
  //       });
  //     }catch (error) {
  //       console.error("Error initializing EditorJS:", error);
  //     }
     
  //   }

  //   return () => {
  //     if (editorInstance.current) {
  //       editorInstance.current.save().then(outputData => {
  //         saveContent(); // 언마운트 시 마지막으로 저장
  //       });
  //       editorInstance.current.destroy();
  //       editorInstance.current = null;
  //     }
  //     clearTimeout(saveTimeout.current);
  //   };
  // }, []);

  // useEffect(() => {
  //   if (editorInstance.current && content) {
  //     try {
  //       editorInstance.current.render(content); // 새로운 데이터를 에디터에 반영
  //     } catch (error) {
  //       console.error("Error while rendering content in EditorJS:", error);
  //     }
  //   }
  // }, [content]); // content가 변경될 때 실행

  // 제목이 변경될 때 저장
  

  useEffect(() => {
    console.log("Editor Instance:", editorInstance.current);
    console.log("Content Updated:", content);
  }, [content]);

  return (
    <EditorContainer>
    <div id="editorjs"></div> {/* 반드시 ID가 존재해야 함 */}
    </EditorContainer>
  );
};

export default Editor;
