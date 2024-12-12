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
import usePageSocket from "../../util/usePageSocket";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// 스타일 정의
const EditorContainer = styled.div`
  width: 100%;
  max-width: 1440px;
  // margin: 0 auto;
  padding: 20px;
`;

const Editor = ({  title, content, setContent,selectId,userId }) => {
  const editorInstance = useRef(null);
  const saveTimeout = useRef(null);
  const [currentPageId, setCurrentPageId] = useState(null);
  const { sendWebSocketMessage } = usePageSocket({});
  const [sendData, setSendData] = useState();
  const queryClient = useQueryClient();

  useEffect(()=>{
    if(selectId){
      setCurrentPageId(selectId)
      return () => {
        if (editorInstance.current) {
          editorInstance.current.destroy();
          editorInstance.current = null;
        }
      };
    }
  },[selectId])

  useEffect(() => {
    if (typeof content === 'object' && content !== null && !editorInstance.current && currentPageId != null) {
      // EditorJS가 아직 초기화되지 않았으면 초기화
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
        data: content || { blocks: [] }, // 처음 데이터 설정
        placeholder: "여기에 내용을 입력하세요...",
        autofocus: true,
        onChange: async () => {
          try {
            const savedData = await editorInstance.current.save();
            setSendData(savedData)
          } catch (error) {
            console.error("Error while getting content from EditorJS:", error);
          }
        },
      });
    }
    
  }, [currentPageId]);


  const putPageContent = useMutation({
    mutationFn : async () => {
        try {
            const resp = await axiosInstance.put("/api/page/content",{
                content : JSON.stringify(sendData),
                title : title,
                id : selectId
            })
            return resp.data
        } catch (err) {
            return err
        }
    },
    onSuccess : (data) => {
      queryClient.invalidateQueries(['page-content'])
    },
    onError : (err) => {

    }
  })

  useEffect(()=>{
    if(sendData&&currentPageId){
      const data = {
        sendData,
        selectId,
        userId
      }
      sendWebSocketMessage(data,"/app/page/update")
      putPageContent.mutate();
    }
  },[sendData])

  return (
    <EditorContainer>
    <div id="editorjs"></div> {/* 반드시 ID가 존재해야 함 */}
    </EditorContainer>
  );
};

export default Editor;
