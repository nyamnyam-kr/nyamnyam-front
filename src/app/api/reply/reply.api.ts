// src/app/api/reply/reply.api.ts

import axios from "axios";

export const fetchReply = async (postId: number) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/replies/post/${postId}`);
    return response.data;
  } catch (error) {
    console.error("reply fetch fail:", error);
    throw error;
  }
};

export const insertReply = async (replyData: any): Promise<Response> => {
  return await fetch('http://localhost:8080/api/replies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(replyData),
  } 
);
};

export const deleteReply = async (replyId: number) => {
  const response = await fetch(`http://localhost:8080/api/replies/${replyId}`, {
    method: 'DELETE',
  });

  return response;
};



