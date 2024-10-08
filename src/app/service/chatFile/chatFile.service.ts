// src/service/chatFile.service.ts
import * as chatFileApi from '../../api/chatFile/chatFile.api'

// 파일 업로드
export const uploadFile = async (chatId: string, sender: string, files: File[]): Promise<any> => {
  try {
    const result = await chatFileApi.uploadFile(chatId, sender, files);
    return result; // 업로드된 파일 목록을 반환
  } catch (error) {
    console.error('파일 업로드 서비스 오류:', error);
    throw error;
  }
};

// 특정 채팅 메시지에 첨부된 파일들 조회
export const getFilesByChatId = async (chatId: string): Promise<any> => {
  try {
    const files = await chatFileApi.getFilesByChatId(chatId);
    return files; // 채팅 메시지에 첨부된 파일 목록 반환
  } catch (error) {
    console.error('채팅 메시지 파일 조회 서비스 오류:', error);
    throw error;
  }
};

// 특정 채팅방에 첨부된 모든 파일 조회
export const getFilesByChatRoomId = async (chatRoomId: string): Promise<any> => {
  try {
    const files = await chatFileApi.getFilesByChatRoomId(chatRoomId);
    return files; // 채팅방에 첨부된 파일 목록 반환
  } catch (error) {
    console.error('채팅방 파일 조회 서비스 오류:', error);
    throw error;
  }
};

// 특정 파일 ID로 파일 정보 조회
export const getFileById = async (id: string): Promise<any> => {
  try {
    const file = await chatFileApi.getFileById(id);
    return file; // 파일 정보 반환
  } catch (error) {
    console.error('파일 조회 서비스 오류:', error);
    throw error;
  }
};

// 파일 삭제
export const deleteFileById = async (id: string): Promise<boolean> => {
  try {
    return await chatFileApi.deleteFileById(id); // 삭제 결과 반환
  } catch (error) {
    console.error('파일 삭제 서비스 오류:', error);
    throw error;
  }
};
