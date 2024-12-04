import { useEffect, useState } from "react";
import DocumentAside from "../../components/document/DocumentAside";
import { useAuthStore } from "../../store/useAuthStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../services/axios";
import { useLinkClickHandler, useLocation, useNavigate } from "react-router-dom";
import { CustomSVG } from "@/components/project/_CustomSVG";

export default function DocumentLayout({children, isDetailVisible , selectedFolder, uid ,closeDetailView}){
    console.log("유아이디!!!",uid);
    console.log("selectedFolder:", selectedFolder);
    const navigate = useNavigate();


    // 액세스 권한 메시지 결정 함수
  const getAccessMessage = () => {
    if (!selectedFolder) return null;

    if (selectedFolder.isShared === 0 && selectedFolder.ownerId === uid) {
      return "나(비공개)";
    }

    if (selectedFolder.isShared === 1 && selectedFolder.ownerId !== uid) {
      return "항목의 공유 정보를 볼 권한이 없습니다.";
    }

    if (selectedFolder.isShared === 1 && selectedFolder.ownerId === uid) {
      return "나, 홍합";
    }

    return null;
  };

  const linkHandler = (selectedFolder) => {
    if (!selectedFolder || !selectedFolder.path) {
        console.error("selectedFolder 또는 path가 유효하지 않습니다.");
        return;
    }

    const pathParts = selectedFolder.path.split('/');
    console.log("여기", pathParts);

    // 조건에 따라 'mydrive' 또는 다른 경로로 설정
    if (pathParts[2] === uid && pathParts.length === 4) {
        // 'mydrive' 조건에 해당하면 /document로 이동
        console.log("mydrive 조건 만족");
        navigate('/document');
    } else {
        // 그 외의 경우 parentId를 기준으로 이동
        const lastFolderName = pathParts[pathParts.length - 2]; 
        console.log("parentId 경로로 이동");
        navigate(`/document/list/${selectedFolder.parentId}`,{
            state:{
                folderName: lastFolderName
            }
        });
    }
};

    return (<>
        <div id='document-container1'>
            <DocumentAside />
            <section className={`document-main1 ${isDetailVisible ? 'reduced' : ''}`}>
                {children}
            </section>
            {isDetailVisible && selectedFolder && (<>
                <section className='document-detail'>
                    <section className="flex justify-between w-[98%]">
                        <span className=" flex flex-row items-center  text-[23px] ">
                            <img 
                            className="mr-[10px]"
                            src={selectedFolder.isShared === 0 ? '/images/folder.svg' : '/images/shared_folder.svg'} 
                            alt="" />
                        {selectedFolder.name}
                        </span>
                        <button className="text-bold  text-[20px] " onClick={closeDetailView}>X</button>
                    </section>
                    <section className="flex flex-col  my-[30px] text-center items-center">
                        <img 
                            className="mr-[10px] w-[100px] h-[100px]"
                            src={selectedFolder.isShared === 0 ? '/images/folder.svg' : '/images/shared_folder.svg'} 
                            alt="" />
                      
                    </section>
                    <div className="mb-[20px]">
                        <span className="text-[15px] ">액세스 권한이 있는 사용자</span>
                        <br/>
                        <span className="text-[14px]">{getAccessMessage()}</span>
        
                    </div>
                    <hr />
                    <section>
                        <div className="container  max-w-[800px]  py-4 font-sans">
                            <h2  className="text-[15px]">폴더 세부정보</h2>
                            <div className="my-[10px] flex flex-col">
                            <span className="BowpK">유형</span>
                            <span className="BowpK">Plantry Drive 폴더</span>
                            </div>
                            <div className="my-[10px] flex flex-col">
                            <span className="BowpK">크기</span>
                            <span className="BowpK">Plantry Drive 폴더</span>
                            </div>
                            <div className="my-[10px] flex flex-col">
                            <span className="BowpK">사용한 용량</span>
                            <span className="BowpK">Plantry Drive 폴더</span>
                            </div>
                            <div className="my-[10px] flex flex-col">
                            <span className="BowpK">위치</span>
                            <div className="BowpK border py-2 px-3 rounded-[8px]"  style={{
                                    display: "inline-flex", // 콘텐츠 크기에 맞게 조정
                                    width: "fit-content",
                                    alignItems: "center",   // 이미지와 텍스트 정렬
                                    whiteSpace: "nowrap",   // 줄 바꿈 방지
                                    cursor: "pointer",
                                }} 
                                onClick={() => linkHandler(selectedFolder)} // 수정된 linkHandler 호출
                                >                                
                                <img 
                                    className="mr-[10px] w-[20px] h-[20px]"
                                    src={
                                        selectedFolder.parentId === null
                                            ? '/images/drive-icon.svg' // 드라이브 이미지
                                            : selectedFolder.isShared === 0
                                            ? '/images/folder.svg' // 일반 폴더 이미지
                                            : '/images/shared_folder.svg' // 공유 폴더 이미지
                                    }
                                    alt=""
                                />
                                <span className="w-auto inline-block">
                                    {selectedFolder.path
                                    ? (() => {
                                        const pathParts = selectedFolder.path.split('/');
                                        console.log("여기",pathParts);
                                        const basePath = pathParts.slice(0, -1).join('/'); // 경로에서 마지막 폴더를 제외한 부분
                                        const lastFolderName = pathParts[pathParts.length - 2]; // 마지막 폴더 이름
                                        return pathParts[2] === uid && pathParts.length ===4? 'mydrive' : lastFolderName;
                                    })()
                                    : '경로 없음'}
                                </span>

                            </div>

                            </div>
                            <div className="my-[10px] flex flex-col">
                            <span className="BowpK">소유자</span>
                            <span className="BowpK">{selectedFolder.ownerId === uid ? '나' : selectedFolder.ownerId}</span>
                            </div>
                            <div className="my-[10px] flex flex-col">
                            <span className="BowpK">수정날짜</span>
                            <span className="BowpK">{selectedFolder.updatedAt}</span>
                            </div>
                            <div className="my-[10px] flex flex-col">
                            <span className="BowpK">생성날짜</span>
                            <span className="BowpK">{selectedFolder.createdAt || 0}</span>
                            </div>
                            <div className="my-[10px] flex flex-col">
                            <span className="BowpK">설명</span>
                            <span className="BowpK"><input type="text"     
                                    placeholder={selectedFolder.description || "설명 없음"} 
                            />
                            </span>
                            </div>
                            
                        </div>
                    </section>
                </section>
               
            
            </>
               
            )}
        </div>
    </>);
}