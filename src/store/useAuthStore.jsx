import axios from "axios";
import { create } from "zustand";
import axiosInstance from "@/services/axios.jsx";
/*
    날짜 : 2024/11/28
    이름 : 박연화
    내용 : accessToken 처리 
*/
const baseURL = import.meta.env.VITE_API_BASE_URL;

export const useAuthStore = create((set) => ({
  accessToken: null, // 초기값: null
  authorized: false, // 로그인 상태 초기값

  // 토큰 저장 및 로그인 상태 업데이트
  setAccessToken: (token) =>
    set(() => ({ accessToken: token, authorized: token })),

  getAccessToken: () => {
    return useAuthStore.getState().accessToken;
  },

  removeAccessToken: () => {
    set(() => ({ accessToken: null, authorized: false }));
  },

  // 토큰 복호화 함수
  decodeAccessToken: () => {
    const token = useAuthStore.getState().accessToken; // 상태 객체에서 직접 가져옴
    if (!token) return null;

    try {
      const payloadBase64 = token.split(".")[1];
      const payloadJson = atob(payloadBase64);
      return JSON.parse(payloadJson);
    } catch (error) {
      console.error("Invalid token format or decoding error:", error);
      return error;
    }
  },

  //토큰 만료 검증
  isTokenExpired: () => {
    const token = useAuthStore.getState().getAccessToken();
    console.log("현재 토큰:", token);
    if (!token) return true; // 토큰이 없으면 만료 처리

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // 토큰 디코딩
      const now = Math.floor(Date.now() / 1000); // 현재 시간을 초 단위로 계산

      // 토큰의 실제 만료 시간인 exp 사용
      const expirationTime = payload.exp; // JWT payload에서 만료 시간(exp)을 가져옵니다.
      const isExpired = expirationTime < now; // 만료 체크

      if (isExpired) {
        // 만료 시 상태 초기화
        useAuthStore.getState().removeAccessToken();
        console.log("토큰이 만료되었습니다.");
      } else {
        // 남은 시간 계산
        const timeLeft = expirationTime - now;
        console.log(`토큰은 ${timeLeft}초 후 만료됩니다.`);
      }

      return isExpired;
    } catch (e) {
      console.error("잘못된 토큰 형식");
      useAuthStore.getState().removeAccessToken(); // 잘못된 토큰 형식도 삭제
      return true;
    }
  },

  // 리프레시 토큰으로 새 액세스 토큰 요청
  refreshAccessToken: async () => {
    try {
      const response = await axios.post(
        `${baseURL}/api/auth/refresh`,
        {},
        { withCredentials: true }
      );

      console.log("Response status:", response.status); // 상태 코드 출력

      if (response.status === 200 && response.data.accessToken) {
        useAuthStore.getState().setAccessToken(response.data.accessToken); // 새 액세스 토큰 상태 갱신
        return response.data.accessToken;
      } else {
        console.error("Failed to refresh token: no accessToken in response");
        useAuthStore.getState().logout(); // 실패 시 상태 초기화
        return null;
      }
    } catch (error) {
      console.error(
        "Error during token refresh:",
        error.response?.status,
        error.response?.data || error.message
      );
      useAuthStore.getState().logout(); // 실패 시 상태 초기화
      return null;
    }
  },

  // 로그아웃 처리
  logout: () => {
    axiosInstance
      .post("/api/auth/logout", null)
      .then((resp) => {
        console.log("로그아웃! 잘 가세요!");
      })
      .catch((err) => {
        console.error("Logout failed", err);
      });
    set(() => ({ accessToken: null, authorized: false }));
    localStorage.removeItem("uid"); // localStorage에서 uid 제거
  },
}));
