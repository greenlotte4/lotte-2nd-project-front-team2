import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import '@/pages/document/Document.scss';
import { CustomSearch } from '@/components/Search';
import { DocumentCard1 } from '../../components/document/DocumentCard1';
import { DocumentCard2 } from '../../components/document/DocumentCard2';
import DocumentLayout from '../../layout/document/DocumentLayout';
import axiosInstance from '@/services/axios.jsx';
import NewFolder from '../../components/document/NewFolder';
import useUserStore from '../../store/useUserStore';
import { Modal } from '../../components/Modal';
import FileUploads from '../../components/document/FileUploads';
import RenameModal from '../../components/document/ChangeName';
import ContextMenu from '../../components/document/ContextMenu';
import ContextFileMenu from '../../components/document/ContextFileMenu';

export default function Trash() {
    const [viewType, setViewType] = useState('box'); // Default to 'box'
    const [isOpen, setIsOpen] = useState(false);
    const [folder, setFolder] = useState(false);
    const [editing, setEditing] = useState(false); // 이름 변경 모드
    const [newFolderName, setNewFolderName] = useState(''); // 새로운 폴더 이름
    const [isFavorite,setIsFavorite] =useState();

    const location = useLocation();
    const user = useUserStore((state) => state.user);
    const queryClient = useQueryClient();
    const [draggedFolder, setDraggedFolder] = useState(null); // 드래그된 폴더
    const fileServerBaseUrl = `http://3.35.170.26:90/download/`;

    const [isDetailVisible, setIsDetailVisible] = useState(false); // 상세 정보 표시 상태 추가
    const [selectedFolder, setSelectedFolder] = useState(null); // 선택된 폴더 정보 상태 추가
    const [selectedFile, setSelectedFile] = useState(null); // 선택된 폴더 정보 상태 추가

    const handleDetailToggle = (folder) => {
        console.log("handleDetailToggle",folder)
        setSelectedFile(null);

        setSelectedFolder(folder); // 선택된 폴더 정보 설정
        setIsDetailVisible(!isDetailVisible);
    };

    const closeDetailView = () => {
        setIsDetailVisible(false);
        setSelectedFolder(null);
        setSelectedFile(null)
      };

      const handleDetailFileToggle = (file) => {
        console.log("handleDetailFileToggle",file)
        setSelectedFolder(null);
    
        setSelectedFile(file); // 선택된 폴더 정보 설정
        setIsDetailVisible(!isDetailVisible);
    };

    const closeDetailFileView = () => {
        setIsDetailVisible(false);
        setSelectedFile(null);
      };


    const [menuState, setMenuState] = useState({
        isMenuOpen: false,
        position: { top: 0, left: 0 },
        activeFolder: null, // 현재 활성화된 폴더
    });

    const closeMenu = () => {
        setMenuState((prev) => ({ ...prev, isMenuOpen: false, activeFolder: null }));
    };

    const toggleMenu = (e, folder) => {
        e.preventDefault(); // 기본 컨텍스트 메뉴 방지
        setMenuState({
            isMenuOpen: true,
            position: { top: e.clientY, left: e.clientX },
            activeFolder: folder,
        });
    };

    console.log(location);

    // 폴더 및 파일 데이터 가져오기
    const { data, isLoading, isError } = useQuery({
        queryKey: [`trash`],
        queryFn: async () => {
          try {
              const response  = await axiosInstance.get(`/api/drive/trash`);
        
              return response.data;
          } catch (error) {
              console.error("Error fetching favorites:", error);
              throw new Error("Failed to fetch favorites.");
          }
        },
        staleTime: 300000, // 데이터가 5분 동안 신선하다고 간주
    });

    // 폴더 이름 변경 Mutation
    const renameFolderMutation = useMutation({
        mutationFn: async (newName) => {
            if (!newName) throw new Error('Folder name cannot be empty');
            await axiosInstance.put(`/api/drive/folder/${folderId}/rename`, { newName });
        },
        onError: (error) => {
            console.error('Failed to rename folder:', error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['favorite', folderId, user.uid]);
            setEditing(false);
        },
    });
    // 파일 업로드 Mutation
    const uploadFileMutation = useMutation({
        mutationFn: async (files) => {
            const formData = new FormData();
            files.forEach((file) => formData.append('files', file));
            await axiosInstance.post(`/api/drive/upload?folderId=${folderId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorite', folderId, user.uid] });
        },
    });

    // 이름 변경 핸들러
    const handleRename = () => {
        if (newFolderName.trim() && newFolderName !== location.state?.folderName) {
            renameFolderMutation.mutate(newFolderName);
        }
    };

    // 드래그 시작 핸들러
    const handleDragStart = (folder) => {
        console.log("handelDragStart ",folder)
        setDraggedFolder(folder); // 드래그된 폴더 저장
    }
     
     // 드래그 오버 핸들러 (드롭 가능 영역 활성화)
     const handleDragOver = (e) => {
        e.preventDefault(); // 기본 동작 방지
    };

  
    
    
    // Folder Context Menu State
    const [contextMenu, setContextMenu] = useState({
        visible: false,
        position: { top: 0, left: 0 },
        folder: null,
    });

    // File Context Menu State
    const [contextFileMenu, setContextFileMenu] = useState({
        visible: false,
        position: { top: 0, left: 0 },
        file: null,
    });

// Close Handlers
    const handleCloseFolderMenu = () => setContextMenu({ visible: false, position: { top: 0, left: 0 }, folder: null });
    const handleCloseFileMenu = () => setContextFileMenu({ visible: false, position: { top: 0, left: 0 }, file: null });
    const contextMenuRef = useRef(null); // 메뉴 DOM 참조
    const contextFileMenuRef = useRef(null); // 메뉴 DOM 참조

    const handleCloseMenu = () => {
        setContextMenu({ visible: false, position: { top: 0, left: 0 }, folder: null });
    };

    const handleContextMenu = (e, folder) => {
        e.preventDefault(); // 기본 컨텍스트 메뉴 방지
        setContextMenu({
            visible: true,
            position: { top: e.clientY, left: e.clientX },
            folder,
            folderId : folder.id,
            folderName: folder.name,
            path: folder.path,
        });
    };

    const handleContextFileMenu = (e, file) => {
        e.preventDefault(); // 기본 컨텍스트 메뉴 방지
        setContextFileMenu({
            visible: true,
            position: { top: e.clientY, left: e.clientX },
            file,
            fileId : file.id,
            fileName: file.name,
            path: file.path,
        });
    };


    
    
    

    // 드래그 앤 드롭 업로드 핸들러
    const handleFileDrop = useCallback(
        (event) => {
            event.preventDefault();
            const files = Array.from(event.dataTransfer.files);
            if (files.length === 0) {
                console.error('No files dropped');
                return;
            }
            uploadFileMutation.mutate(files);
        },
        [uploadFileMutation]
    );

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleRename();
        }
    };

    //파일 다운로드 핸들러
    const downloadHandler = (file) => {
        if (!file || !file.id) {
            console.error('Invalid file:', file);
            return;
        }
        const downloadUrl = `${fileServerBaseUrl}${file.path}`;
    
        // 다운로드 요청
       /*  window.open(downloadUrl, file.savedName); */
        // 가상의 링크 생성
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', file.originalName); // 원본 파일명으로 다운로드
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    };

    //폴더 zip 다운로드 핸들러
    const zipDownloadHandler = async (folder) => {
        console.log('Selected folder for zip download:', folder); // Debugging log
        const id = contextMenu.folderId;
        
        try {
            const response = await axiosInstance.get(`/api/drive/generateZip/${id}`);
    
            if (response.status === 200) {
                console.log('zip 파일 생성 성공');
                const zipName = response.data.zipName;
                const downloadUrl = `${fileServerBaseUrl}uploads/zip/${zipName}`;
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', folder.name); // 원본 파일명으로 다운로드
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.error('zip 파일 생성 실패:', response.data);
            }
        } catch (error) {
            console.error('zip 파일 생성 업데이트 중 오류 발생:', error);
        }
    }

  



    const subFolders = (data?.subFolders || [])
    .map((folder) => ({
        ...folder,
        type: 'folder',
        order: folder.order || 0, // 기본값 설정
    }))
    .sort((a, b) => (a.order || 0) - (b.order || 0)); // order 기준 정렬

    
    const files = (data?.files || [])
    .map((file) => ({
        ...file,
        type: 'file', // 파일 타입 추가
    }));

    const maxOrder = Math.max(...subFolders.map(folder => folder.order || 0));
    const fileMaxOrder =
        files.length > 0
            ? Math.max(...files.map(file => file.order || 0))
            : 0; // 기본값을 0으로 설정

    console.log("fileMaxorder",fileMaxOrder);

    
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading folder contents.</div>;

    return (
        <DocumentLayout isDetailVisible={isDetailVisible} selectedFolder={selectedFolder} selectedFile={selectedFile} path={location.pathname} parentfolder={location.state?.folderName} uid={data.uid} closeDetailView={closeDetailView}>
            <section className="flex gap-4 items-center">
              
              <span className="text-[25px] ml-[25px]">{location?.state?.folderName}</span>
          
            </section>
            <section className="flex justify-between mt-[22px] mb-6">
                <div className="flex gap-4 mx-[15px] w-[98%] items-center">
                    <CustomSearch width1="20" width2="80" />
                    <p className="ml-4">View :</p>
                    <button
                            className={`list ${viewType === 'list' ? 'active' : ''}`} // Add active class for styling
                            onClick={() => setViewType('list')}> 
                            <img className={`list ${viewType === 'list' ? 'active' : ''}`} src='/images/document-note.png'
                                  style={{
                                    filter: viewType === 'list' 
                                        ? 'invert(29%) sepia(96%) saturate(748%) hue-rotate(180deg) brightness(89%) contrast(101%)' 
                                        : 'invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(0%)', // 블랙 필터
                                }}
                            ></img>

                            </button>
                        <button
                            className={`box ${viewType === 'box' ? 'active' : ''}`} // Add active class for styling
                            onClick={() => setViewType('box')}>                       
                            <img className={`list ${viewType === 'list' ? 'active' : ''}`} 
                                 style={{
                                    filter: viewType === 'box'
                                        ? 'invert(29%) sepia(96%) saturate(748%) hue-rotate(180deg) brightness(89%) contrast(101%)'
                                        : 'invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(0%)', // 블랙 필터
                                }}
                                src='/images/document-menu.png' />
                            </button>
                </div>
                <div className="flex gap-2">
                  
                </div>
            </section>

            {viewType === 'box' ? (
                <div className='h-[600px] mx-[30px] w-[97%] overflow-scroll scrollbar-none'>
                   {subFolders?.length === 0 || subFolders === null ? (
                       <div></div>
                        ) : (
                        <>
                            <div className='sticky pb-[5px] h-[26px] my-[10px] text-[15px] top-0 z-10 bg-white'>폴더</div>
                            <section className="flex items-center flex-wrap relative">
                            {subFolders.map((folder) => (
                                <DocumentCard1
                                key={folder.id}
                                folder={folder}
                                folderId={folder.id}
                                folderName={folder.name}
                                setSelectedFolder={setSelectedFolder}
                                path={folder.path}
                                cnt={folder.cnt}
                                isFavorite={folder.isPinned}
                                setIsFavorite={setIsFavorite}
                                updatedAt={folder.updatedAt}
                                onDragStart={handleDragStart}
                                onDrop={(e) => handleDrop(folder, "before")}
                                onDragOver={handleDragOver}
                                onContextMenu={handleContextMenu}
                                downloadHandler={zipDownloadHandler} // 수정: folder 객체 전달
                                onClick={() => {
                                    console.log('Selected folder:', folder);
                                    setSelectedFolder(folder);
                                }}
                                />
                            ))}
                            </section>
                        </>
                    )}
                   {files?.length ===0 || files===null? (
                                            <div></div>

                    )
                   :(<>
                         <div className='text-[15px] my-[20px]'>file</div>
                            <section className="inline-block ">
                                {files.map((file) => (
                                    <DocumentCard2                                 
                                        onContextMenu={handleContextFileMenu}
                                        key={file.id} 
                                        file={file} 
                                        fileName={file.originalName} 
                                        path={file.path} 
                                        savedName={file.savedName}
                                        setSelectedFile={setSelectedFile}
                                        downloadHandler={() => downloadHandler(file)}
                                        />
                                ))}
                            </section>
                   </>)}
                   
                </div>
            ) : (<>
                <div  className="h-[570px] overflow-scroll scrollbar-none">
                    <table className="docList mx-[20px] w-[98%]">
                    <thead className="h-[48px] bg-[#F2F4F8] sticky top-0 z-10">
                        <tr className='text-left'>
                            <th className='pl-[20px]'><input type="checkbox"  /></th>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Size</th>
                            <th>Last Modified</th>
                        </tr>
                    </thead>
                    <tbody >
                    {[...subFolders, ...files].map((item) => {
                        console.log("아이템!!",item);
                        const isFolder = item.type === "folder"; // Assume `type` differentiates folder/file
                        return (
                        <tr 
                            key={item.id}
                            draggable
                            onDragStart={() => handleDragStart(item)} // 드래그 시작 핸들러
                            onDragOver={(e) => handleDragOver(e)} // 드래그 오버 핸들러
                            onDrop={(e) => handleDrop(item, "before")} // 드롭 시 동작 (리스트에서는 기본적으로 "before")
                            className="draggable-row text-left"
                            onContextMenu={(e) =>
                                isFolder ? handleContextMenu(e, item) : handleContextFileMenu(e, item)
                              } // Wrap in a function                           
                        >
                            <td  className='pl-[20px]'><input type="checkbox" /></td>
                            <td className='text-left'>
                            {isFolder ? (
                                <Link to={`/document/list/${item.id}`} state={{ folderName: item.name }}>
                                📁 {item.name} {/* Add a folder icon */}
                                </Link>
                            ) : (
                                <span>
                                📄 {item.originalName} {/* Add a file icon */}
                                </span>
                            )}
                            </td>
                            <td>{isFolder ? "Folder" : "File"}</td>
                            <td>{item.size || "-"}</td>
                            <td  className='w-[2
                            00px]'>{item.updatedAt || "Unknown"}</td>
                        </tr>
                        );
                    })}
                                        
                </tbody>
                </table>
                
                </div>
                <button>선택삭제</button>
                </>

            )}

          
             {/* ContextMenu 컴포넌트 */}
             <ContextMenu
                    visible={contextMenu.visible}
                    position={contextMenu.position}
                    onClose={handleCloseMenu}
                    folder={contextMenu.folder}
                    folderName={contextMenu.folderName}
                    folderId={contextMenu.folderId}
                    path={contextMenu.path}
                    onDetailToggle={() => handleDetailToggle(contextMenu.folder)} // 상세 정보 토글 함수 전달
                    downloadHandler={() => zipDownloadHandler(folder)}
                    type={"trash"}

                />
              <ContextFileMenu
                    visible={contextFileMenu.visible}
                    position={contextFileMenu.position}
                    onClose={handleCloseFileMenu}
                    file={contextFileMenu.file}
                    fileName={contextFileMenu.file?.name} // Use optional chaining to avoid errors
                    fileId={contextFileMenu.file?.id}
                    path={contextFileMenu.file?.path}
                    onDetailToggle={() => handleDetailFileToggle(contextFileMenu.file)}
                    downloadHandler={downloadHandler}
                />
            
        </DocumentLayout>
    );
}
