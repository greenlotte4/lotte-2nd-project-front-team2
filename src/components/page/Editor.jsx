import React, { useCallback, useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import styled from "styled-components";
import axiosInstance from "../../services/axios";
import useUserStore from "../../store/useUserStore";
import { useParams } from "react-router-dom";
import debounce from "lodash.debounce";
import usePageSocket from "../../util/usePageSocket";
import { useQuery } from "@tanstack/react-query";

const EditorContainer = styled.div`
  width: 100%;
  max-width: 1440px;
  padding: 20px;
`;

const Editor = () => {
  const editorInstance = useRef(null);
  const [receiveData, setReceiveData] = useState(null);
  const { sendWebSocketMessage, updatePageId, isConnected } = usePageSocket({ setReceiveData });
  const { pageId } = useParams();
  const userId = useUserStore((state) => state.user?.uid);
  const [editorData, setEditorData] = useState(null);

  const isReceivedData = useRef(false);
  const preventRecursiveSyncRef = useRef(false);

  const fetchPageData = async (pageId) => {
    try {
      const response = await axiosInstance.get(`/api/page/content/${pageId}`);
      return response.data;
    } catch (err) {
      console.error("Error fetching page data:", err);
      return null;
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['page-data', pageId],
    queryFn: () => fetchPageData(pageId),
    enabled: !!pageId,
  });

  const saveDataDebounced = useCallback(
    debounce(async (updatedData) => {
      try {
        const response = await axiosInstance.put(`/api/page/content/${pageId}`, { content: updatedData });
        console.log('Data saved:', response.data);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }, 1000),
    [pageId]
  );

  useEffect(() => {
    if (pageId && data) {
      editorInstance.current = new EditorJS({
        holder: "editorjs",
        data: JSON.parse(data.content) || { blocks: [] },
        autofocus: true,
        onReady: () => {
          console.log("Editor is ready!");
          updatePageId(pageId);
        },
        onChange: async () => {
          if (preventRecursiveSyncRef.current) {
            preventRecursiveSyncRef.current = false;
            return;
          }

          const updatedData = await editorInstance.current.save();
          setEditorData(updatedData);
          saveDataDebounced(updatedData);

          if (isConnected) {
            sendWebSocketMessage(
              {
                type: 'update',
                pageId,
                content: updatedData,
                uid: userId,
              },
              "/app/page/update"
            );
          }
        },
      });
    }

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, [pageId, data, saveDataDebounced]);

  useEffect(() => {
    if (receiveData && editorInstance.current) {
      // 자신의 메시지는 무시
      if (receiveData.uid === userId) return;

      // 재귀적 동기화 방지 플래그 설정
      preventRecursiveSyncRef.current = true;

      const updatedBlocks = receiveData.content.blocks;
      editorInstance.current.blocks.clear();
      
      updatedBlocks.forEach((block) => {
        editorInstance.current.blocks.insert(block.type, block.data);
      });
    }
  }, [receiveData, userId]);

  // 로딩 및 에러 상태 처리
  if (isLoading) {
    return <EditorContainer>로딩 중...</EditorContainer>;
  }

  if (isError) {
    return <EditorContainer>페이지 데이터를 불러오는 데 실패했습니다.</EditorContainer>;
  }

  return (
    <EditorContainer>
      <div id="editorjs"></div>
    </EditorContainer>
  );
};

export default Editor;
