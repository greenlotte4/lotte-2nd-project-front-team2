import React, { useCallback, useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import styled from "styled-components";
import axiosInstance from "../../services/axios";
import useUserStore from "../../store/useUserStore";
import { useParams } from "react-router-dom";
import debounce from "lodash.debounce";
import usePageSocket from "../../util/usePageSocket";
import { useQuery } from "@tanstack/react-query";
import Table from '@editorjs/table';
import Header from '@editorjs/header';
import Image from '@editorjs/image';
import TextColor from "editorjs-color";
import Warning from '@editorjs/warning';
import Checklist from '@editorjs/checklist';
import CodeTool from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import RawTool from '@editorjs/raw';
import AttachesTool from '@editorjs/attaches';
import InlineCode from '@editorjs/inline-code';
import AIText from '@alkhipce/editorjs-aitext'
import DragDrop from "editorjs-drag-drop";
import LinkTool from '@editorjs/link';
import Comment from 'editorjs-comment';
import CustomServerLinkTool from '@/util/CustomServerLinkTool'

const EditorContainer = styled.div`
  width: 100%;
  max-width: 1420px;
  padding: 20px;
`;

class CustomLinkTool {
  constructor({ endpoint }) {
    this.endpoint = endpoint;
  }

  // 링크를 입력받았을 때 호출되는 메서드
  async createLink(inputText) {
    try {
      // 백엔드에 API 요청 보내기
      const response = await axiosInstance.get(this.endpoint+"?url="+inputText);

      const data = await response.data
      const generatedUrl = data.url; // 백엔드에서 반환된 URL을 받아옴

      // Editor.js에 링크 추가
      this.insertLink(generatedUrl);
    } catch (error) {
      console.error('링크 생성 실패:', error);
    }
  }

  // 생성된 URL을 Editor.js에 삽입하는 메서드
  insertLink(url) {
    // Editor.js에 링크 삽입하는 로직
    // 예: 'editor.blocks.insert' 등을 사용하여 링크 블록을 삽입
  }
}

const Editor = () => {
  const editorInstance = useRef(null);
  const [receiveData, setReceiveData] = useState(null);
  const { sendWebSocketMessage, updatePageId, isConnected } = usePageSocket({ setReceiveData });
  const { pageId } = useParams();
  const userId = useUserStore((state) => state.user?.uid);
  const [editorData, setEditorData] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);

  const isReceivedData = useRef(false);
  const preventRecursiveSyncRef = useRef(false);

  const {
    data : usersData,
    isLoading : isLoadingRole,
    isError : isErrorRole
  } = useQuery({
    queryKey : ['page-user-role',pageId],
    queryFn : async () => {
      try {
        const resp = await axiosInstance.get(`/api/page/role/${pageId}`)
        return resp.data
      } catch (err) {
        return err;
      }
    },
    enabled : !!pageId,
  })

  useEffect(()=>{
    if((Array.isArray(usersData)&&usersData.length>0 && !isLoadingRole && !isErrorRole)){
      const role = (usersData.filter((v)=>v.uid==userId)).map((v)=>v.role).toString();
      setCurrentRole(role)
    }
  },[usersData])

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
    refetchOnMount : false,
    refetchOnWindowFocus : false
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
    if (pageId && data && currentRole != null) {
      

      editorInstance.current = new EditorJS({
        holder: "editorjs",
        data: JSON.parse(data.content) || { blocks: [] },
        autofocus: true,
        readOnly : currentRole == '1',
        onReady: () => {
          console.log("Editor is ready!");
          updatePageId(pageId);
          new DragDrop(editorInstance.current);
          document.body.addEventListener('click', (event) => {
            const target = event.target;
            if (target && target.tagName === 'A') {
                event.preventDefault();
                window.location.href = target.href;
            }
        });
        },
        initialBlock: 'aiText',
        inlineToolbar: true,
        tools: {
          table: Table, // Table tool 추가
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              placeholder: 'Enter a title', // 제목 입력 시 Placeholder 텍스트
              levels: [1, 2, 3], // 사용자가 선택할 수 있는 제목의 수준 (H1, H2, H3)
            },
          },
          checklist: {
            class: Checklist,
            inlineToolbar: true,
          },
          TextColor: {
            class: TextColor, 
            config: {
              tag: "SPAN"
            }
          },
          
          aiText: {
            // if you do not use TypeScript you need to remove "as unknown as ToolConstructable" construction
            class: AIText,
            config: {
              preserveBlank: true,
              inlineToolbar: true, 
              callback: (text) => {
                return new Promise((resolve, reject) => {
                  axiosInstance.post(`/api/page/ai?text=${text}`)
                    .then((response) => {
                      // AI 응답을 받은 후, 그 값을 resolve로 전달
                      console.log(response.data)
                     resolve("<br> AI: "+response.data.choices[0].message.content);  // 서버 응답에서 AI 텍스트를 추출해서 반환
                    })
                    .catch((error) => {
                      // 오류 발생 시 reject로 에러 처리
                      console.error('Error fetching AI response:', error);
                      reject('AI text generation failed');  // 실패 메시지 반환
                    });
                });
              },
            }
          },
          childPage: {
            class: CustomServerLinkTool,
            inlineToolbar: true,
          }, // Link Tool 추가
          inlineCode: {
            class: InlineCode,
            shortcut: 'CMD+SHIFT+M',
          },
          delimiter: Delimiter,
          attaches: {
            class: AttachesTool,
            config: {
              uploader: {
                // 이미지를 업로드할 때 호출되는 함수
                uploadByFile: async (file) => {
                  const formData = new FormData();
                  formData.append('file', file);
  
                  // 서버로 이미지 파일 업로드
                  try {
                    const response = await axiosInstance.post(`/api/page/image/${pageId}`, formData, {
                      headers: {
                        'Content-Type': 'multipart/form-data',
                      },
                    });
                    return {
                      success: 1,
                      file: {
                        url: "http://3.35.170.26:90/pages/"+response.data, // 서버에서 반환한 이미지 URL
                      },
                    };
                  } catch (error) {
                    console.error('Image upload failed:', error);
                    return {
                      success: 0,
                      message: 'Failed to upload image',
                    };
                  }
                },
              },
            },
          },     
          raw: RawTool,
          code: CodeTool,
          warning: {
            class: Warning,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+W',
            config: {
              titlePlaceholder: 'Title',
              messagePlaceholder: 'Message',
            },
          },
          image: {
            class: Image,
            inlineToolbar: true,
            config: {
              uploader: {
                // 이미지를 업로드할 때 호출되는 함수
                uploadByFile: async (file) => {
                  const formData = new FormData();
                  formData.append('file', file);
  
                  // 서버로 이미지 파일 업로드
                  try {
                    const response = await axiosInstance.post(`/api/page/image/${pageId}`, formData, {
                      headers: {
                        'Content-Type': 'multipart/form-data',
                      },
                    });
                    return {
                      success: 1,
                      file: {
                        url: "http://3.35.170.26:90/pages/"+response.data, // 서버에서 반환한 이미지 URL
                      },
                    };
                  } catch (error) {
                    console.error('Image upload failed:', error);
                    return {
                      success: 0,
                      message: 'Failed to upload image',
                    };
                  }
                },
              },
            },
          },
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
  }, [pageId, data, saveDataDebounced , currentRole]);

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
      <div className="overflow-scroll max-h-[700px] scrollbar-none w-full p-[20px]" id="editorjs"></div>
    </EditorContainer>
  );
};

export default Editor;
