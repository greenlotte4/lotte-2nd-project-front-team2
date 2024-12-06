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

const Editor = ({ title, content, setContent, permissions, pageId }) => {
  const editorInstance = useRef(null);
  const saveTimeout = useRef(null);
  const [currentPageId, setCurrentPageId] = useState(null);
  const user = useUserStore((state) => state.user);

  const saveContent = async () => {
    if (!editorInstance.current) return;

    try {
      const savedData = await editorInstance.current.save();
      
      const fullData = {
        id: currentPageId,
        title: title,
        content: JSON.stringify(savedData), // 에디터 데이터를 문자열로 변환
        ownerUid: user.uid,
        permissions: permissions || 'FULL'
      };

      console.log('Saving content to server:', fullData);
      
      const response = await axiosInstance.post("/api/page/save", fullData);
      
      if (response.data && response.data.id) {
        if (!currentPageId) {
          setCurrentPageId(response.data.id);
        }
        setContent(savedData); // 부모 컴포넌트의 content 상태 업데이트
        console.log("Save successful:", response.data);
      }

      return savedData;
    } catch (error) {
      console.error("Error while saving content:", error);
    }
  };

  // 에디터 초기화
  useEffect(() => {
    if (!editorInstance.current) {
      editorInstance.current = new EditorJS({
        holder: "editorjs",
        tools: {
          header: { class: Header, inlineToolbar: ["link", "bold"] },
          list: { class: List, inlineToolbar: true },
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: "/uploadFile",
                byUrl: "/fetchUrl",
              },
            },
          },
          paragraph: { class: Paragraph, inlineToolbar: true },
          table: { class: Table, inlineToolbar: true },
          delimiter: Delimiter,
        },
        data: content || { blocks: [] },
        placeholder: "여기에 내용을 입력하세요...",
        autofocus: true,
        onChange: () => {
          clearTimeout(saveTimeout.current);
          saveTimeout.current = setTimeout(() => {
            saveContent(); // 내용이 변경될 때마다 저장
          }, 1000);
        },
      });
    }

    return () => {
      if (editorInstance.current) {
        editorInstance.current.save().then(outputData => {
          saveContent(); // 언마운트 시 마지막으로 저장
        });
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
      clearTimeout(saveTimeout.current);
    };
  }, []);

  // 제목이 변경될 때 저장
  useEffect(() => {
    if (title && editorInstance.current) {
      saveContent();
    }
  }, [title]);

  

  return (
    <EditorContainer>
      <div id="editorjs"></div>
    </EditorContainer>
  );
};

export default Editor;
