// src/api/chatFile.api.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api/chatFiles'; // 백엔드 서버 주소를 입력하세요.

// 파일 업로드 API
export const uploadFile = async (chatId: string, sender: string, files: File[]): Promise<any> => {
  const formData = new FormData();
  formData.append('chatId', chatId);
  formData.append('sender', sender);

  // 파일 목록을 FormData에 추가
  files.forEach((file) => {
    formData.append('file', file);
  });

  try {
    const response = await axios.post(`${BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('파일 업로드 중 오류 발생:', error);
    throw error;
  }
};

// 특정 채팅 메시지에 첨부된 파일들 조회 API
export const getFilesByChatId = async (chatId: string): Promise<any> => {
  try {
    const response = await axios.get(`${BASE_URL}/by-chat/${chatId}`);
    return response.data;
  } catch (error) {
    console.error('채팅 메시지 파일 조회 중 오류 발생:', error);
    throw error;
  }
};

// 특정 채팅방에 첨부된 모든 파일 조회 API
export const getFilesByChatRoomId = async (chatRoomId: string): Promise<any> => {
  try {
    const response = await axios.get(`${BASE_URL}/by-room/${chatRoomId}`);
    return response.data;
  } catch (error) {
    console.error('채팅방 파일 조회 중 오류 발생:', error);
    throw error;
  }
};

// 특정 파일 ID로 파일 정보 조회 API
export const getFileById = async (id: string): Promise<any> => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('파일 조회 중 오류 발생:', error);
    throw error;
  }
};

// 파일 삭제 API
export const deleteFileById = async (id: string): Promise<any> => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.status === 204; // HTTP 204 No Content가 반환되면 성공
  } catch (error) {
    console.error('파일 삭제 중 오류 발생:', error);
    throw error;
  }
};
