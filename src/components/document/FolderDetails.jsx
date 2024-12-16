function FolderDetails({ folder, uid, closeDetailView,shared, navigate,parentfolder,path }) {

    console.log("folder" , folder);
    const linkHandler = (file) => {
        navigate(path,{state : folder});
   
    };
    const getAccessMessage = () => {
        if (!folder) return null;

        if (folder.isShared === 0 && folder.ownerId === uid) {
            return "나(비공개)";
        }

        if (folder.isShared === 1 && folder.ownerId !== uid) {
            return "항목의 공유 정보를 볼 권한이 없습니다.";
        }

        if (folder.isShared === 1 && folder.ownerId === uid) {
            console.log("공유대상",shared);
            return <>
             {folder.ownerId === uid && folder.isShared === 1 && (
            <>
                {folder.sharedUsers && folder.sharedUsers.length > 0 ? (
                    <ul className="mt-2 space-y-2 flex w-max-[250px] overflow-scroll-y">
                        {folder.sharedUsers.map((user, index) => (
                            <li
                                key={user.id || `shared-user-${index}`}
                                className="relative flex items-center gap-4 p-2"
                            >
                                {/* 프로필 이미지 */}
                                <div className="relative group">
                                    <img
                                        src={user.profile}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full"
                                    />
                                    {/* 호버 시 표시할 이름과 권한 */}
                                    <div className="absolute w-[80px] left-1/2 transform-translate-x-1/2 top-10 hidden group-hover:flex flex-col items-center bg-gray-800 text-white text-xs rounded-lg shadow-lg p-2 z-10">
                                        <span className="font-semibold">{user.name}</span>
                                        <span className="text-gray-400">{user.permission || "권한 없음"}</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">아직 공유된 사용자가 없습니다.</p>
                )}
            </>
        )}
            </>;
        }

        return null;
    };

    return (
        <>
            <section className="flex justify-between w-[98%]">
                <span className="flex flex-row items-center text-[15px]">
                    <img
                        className="mr-[10px]"
                        src={folder.isShared === 0 ? '/images/folder.svg' : '/images/shared_folder.svg'}
                        alt=""
                    />
                    {folder.name}
                </span>
                <button className="text-bold text-[20px]" onClick={closeDetailView}>X</button>
            </section>
            <section className="flex flex-col my-[30px] text-center items-center">
                <img
                    className="mr-[10px] w-[100px] h-[100px]"
                    src={folder.isShared === 0 ? '/images/folder.svg' : '/images/shared_folder.svg'}
                    alt=""
                />
            </section>
            <div className="mb-[20px]">
                <span className="text-[15px]">액세스 권한이 있는 사용자</span>
                <br />
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
                        onClick={() => linkHandler(path)} // 수정된 linkHandler 호출
                        >                                
                        <img 
                            className="mr-[10px] w-[20px] h-[20px]"
                            src={
                                folder.parentId === null
                                    ? '/images/drive-icon.svg' // 드라이브 이미지
                                    : folder.isShared === 0
                                    ? '/images/folder.svg' // 일반 폴더 이미지
                                    : '/images/shared_folder.svg' // 공유 폴더 이미지
                            }
                            alt=""
                        />
                        <span className="w-auto inline-block">
                            {parentfolder}
                        </span>

                    </div>

                    </div>
                    <div className="my-[10px] flex flex-col">
                    <span className="BowpK">소유자</span>
                    <span className="BowpK">{folder.ownerId === uid ? '나' : folder.ownerId}</span>
                    </div>
                    <div className="my-[10px] flex flex-col">
                    <span className="BowpK">수정날짜</span>
                    <span className="BowpK">{folder.updatedAt}</span>
                    </div>
                    <div className="my-[10px] flex flex-col">
                    <span className="BowpK">생성날짜</span>
                    <span className="BowpK">{folder.createdAt || 0}</span>
                    </div>
                    <div className="my-[10px] flex flex-col">
                    <span className="BowpK">설명</span>
                    <span className="BowpK"><input type="text"     
                            placeholder={folder.description || "설명 없음"} 
                    />
                    </span>
                    </div>
                </div>
 
            </section>
        </>
    );
}

export default FolderDetails;
