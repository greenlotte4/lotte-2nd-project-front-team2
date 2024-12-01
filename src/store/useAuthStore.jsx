import { create } from "zustand";
import { persist } from "zustand/middleware";
/*
    날짜 : 2024/11/28
    이름 : 박연화
    내용 : accessToken 처리 
*/

export const useAuthStore = create((set) => ({
    accessToken: null, // 초기값: null
    authorized: false, // 로그인 상태 초기값
    
    // 토큰 저장 및 로그인 상태 업데이트
    setAccessToken: (token) => 
      set(() => ({ accessToken: token, authorized: !!token })),

    getAccessToken: () => {
      return accessToken;
    },

    removeAccessToken: () => {
      accessToken = null;
    },

    //토큰 만료 검증
    isTokenExpired: () => {
      if(!accessToken) return true;

      try{
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);
        return payload.exp < now;
      }catch(e){
        console.error("Invalid token format");
        return true;
      }
    },

    // 리프레시 토큰으로 새 액세스 토큰 요청
    refreshAccessToken: async () => {
      try {
          const response = await fetch("/api/auth/refresh", {
              method: "POST",
              credentials: "include", // 리프레시 토큰은 쿠키로 전송
          });

          if (response.ok) {
              const data = await response.json();
              tokenStorage.setAccessToken(data.accessToken); // 새 액세스 토큰 내부에 저장
              return data.accessToken;
          } else {
              console.error("Failed to refresh token");
          }
      } catch (error) {
          console.error("Error during token refresh:", error);
      }
      return null;
    },

    // API 요청 메서드
    apiRequest: async (url, options = {}) => {
        try {
            // 액세스 토큰 확인 및 갱신
            if (tokenStorage.isTokenExpired()) {
                const newToken = await tokenStorage.refreshAccessToken();
                if (!newToken) {
                    throw new Error("Unable to refresh token");
                }
            }

            const token = tokenStorage.getAccessToken();

            // 요청 헤더에 액세스 토큰 추가
            const headers = {
                ...options.headers,
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json(); // 응답 데이터 반환
        } catch (error) {
            console.error("API Request Error:", error);
            throw error; // 호출한 쪽에서 처리하도록 에러 다시 던짐
        }
    },

    // 로그아웃 처리
    logout: () => {
      set(() => ({ accessToken: null, authorized: false }));
      localStorage.removeItem("auth-storage");
    },
    }));