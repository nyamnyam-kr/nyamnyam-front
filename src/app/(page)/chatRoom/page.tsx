"use client";

import Head from "next/head";
import Link from "next/link";
import Image from 'next/image';
import { useEffect, useState } from "react";
import { deleteChatRoomsService, getChatRoomData, getChatRoomDetails, insertChatRoom } from "src/app/service/chatRoom/chatRoom.service";
import { sendMessageService, subscribeMessages } from "src/app/service/chat/chat.service";
import { ChatRoomModel } from "src/app/model/chatRoom.model";
import { ChatModel } from "src/app/model/chat.model";
import { getNotReadParticipantsCount, getUnreadCount, markMessageAsRead, updateReadBy } from "src/app/api/chat/chat.api";
import dynamic from "next/dynamic"; // Next.js의 dynamic import 사용
import EmojiPicker from "src/app/components/EmojiPicker";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import React from 'react';


export default function Home1() {
  const [chatRooms, setChatRooms] = useState<ChatRoomModel[]>([]);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<string | null>(null);
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoomModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState<ChatModel[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false); // 이모티콘 패널 표시 상태

  const [sender, setSender] = useState<string>(""); // 사용자 ID
  const [unreadCount, setUnreadCount] = useState<number>(0); // 읽지 않은 메시지 수
  const [notReadParticipantsCount, setNotReadParticipantsCount] = useState<number>(0); // 읽지 않은 참가자 수
  const [selectChatRooms, setSelectChatRooms] = useState<any[]>([]);
  const [user, setUser] = useState(null);
  const [chatRoomName, setChatRoomName] = useState<string>(""); // 채팅방 이름
  const [participantNames, setParticipantNames] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const nickname = localStorage.getItem('nickname');
      if (nickname) {
        return [nickname];
      }
    }
    return [];
  });
  const [newParticipantName, setNewParticipantName] = useState<string>(""); // 입력받은 참가자 이름
  const [readBy, setReadBy] = useState<{ [key: string]: boolean }>({}); // 메시지 읽음 상태 관리
  const [files, setFiles] = useState([]); // 업로드할 파일을 관리하는 상

  useEffect(() => {
    const nickname = localStorage.getItem('nickname');
    if (nickname) {
      setSender(nickname); // 로그인된 사용자의 닉네임으로 sender 초기화
      fetchData(nickname);
    }
  }, []);


  const fetchData = async (nickname: string) => {
    if (!nickname) return;
    setLoading(true);
    try {
      const { chatRooms } = await getChatRoomData(nickname);
      setChatRooms(chatRooms);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 로그인한 사용자가 참여하고 있는 모든 채팅방의 읽지 않은 메시지 수 가져오기
  useEffect(() => {
    if (!sender) return;

    const fetchUnreadCounts = async () => {
      try {
        const updatedChatRooms = await Promise.all(
          chatRooms.map(async (room) => {
            const unreadCountResult = await getUnreadCount(room.id, sender);
            return { ...room, unreadCount: unreadCountResult };
          })
        );

        setChatRooms(updatedChatRooms);
      } catch (error) {
        console.error('읽지 않은 메시지 수를 가져오는 중 오류 발생:', error);
      }
    };

    fetchUnreadCounts();
  }, [sender]); // chatRooms를 의존성에서 제거

  // 읽지 않은 참가자 수를 계산하는 함수
  const countNotReadParticipants = (message: ChatModel) => {
    const readByCount = Object.keys(message.readBy).length; // 읽은 참가자 수
    return message.totalParticipants - readByCount; // 읽지 않은 참가자 수
  };

  // 선택된 채팅방의 메시지를 가져오고 읽음 상태 처리하기
   useEffect(() => {
    if (!selectedChatRoomId) return;

    getChatRoomDetails(selectedChatRoomId)
      .then((data) => {
        setSelectedChatRoom(data);
        setMessages(data.messages || []); // 초기 메시지 설정
        // 읽지 않은 메시지 수를 0으로 설정
        setChatRooms((prevRooms) =>
          prevRooms.map((room) =>
            room.id === selectedChatRoomId ? { ...room, unreadCount: 0 } : room
          )
        );
      })
      .catch((error) => console.error(error));

      const token = localStorage.getItem('token');
      // 메시지 스트리밍 구독
      const eventSource = new EventSource(`http://localhost:8081/api/chats/${selectedChatRoomId}?token=${token}`);

    eventSource.onmessage = async (event) => {
      const newMessage = JSON.parse(event.data);

      setMessages((prevMessages) => {
        const messageExists = prevMessages.some(msg => msg.id === newMessage.id);
        if (!messageExists) {
          // 새 메시지를 기존 메시지 목록에 추가
          const updatedMessages = [...prevMessages, newMessage];

          // 메시지를 읽음으로 마킹 처리
          const isRead = newMessage.readBy ? newMessage.readBy[sender] : false; // null 체크
          if (!isRead) {
            markMessageAsRead(newMessage.id, sender)
              .then(() => {
                // 읽음 상태 업데이트
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === newMessage.id
                      ? { ...msg, isRead: true, readBy: { ...msg.readBy, [sender]: true } }
                      : msg
                  )
                );

                // 채팅방의 unreadCount를 업데이트
                setChatRooms((prevChatRooms) =>
                  prevChatRooms.map((room) =>
                    room.id === selectedChatRoomId
                      ? { ...room, unreadCount: Math.max(room.unreadCount - 1, 0) }
                      : room
                  )
                );
              })
              .catch((error) => console.error('Failed to mark message as read:', error));
          }

          return updatedMessages; // 새 메시지 추가
        }
        return prevMessages; // 메시지가 이미 존재하면 상태를 그대로 반환
      });
    };

    eventSource.onerror = (event) => {
      console.error("EventSource 에러:", event);
      eventSource.close(); // 에러 발생 시 EventSource 종료
    };

    return () => {
      eventSource.close(); // 컴포넌트 언마운트 시 EventSource 닫기
    };
  }, [selectedChatRoomId]); // chatRooms를 의존성에서 제거

  const updateUnreadCount = (message: ChatModel) => {
    setChatRooms((prevChatRooms) =>
      prevChatRooms.map((room) =>
        room.id === selectedChatRoomId
          ? { ...room, unreadCount: Math.max(room.unreadCount - 1, 0) }
          : room
      )
    );
  };


  // 메시지 전송 함수
  // sendMessage 함수에서 새로운 메시지를 보낼 때 호출
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    const newMessageData = {
      sender,
      message: newMessage,
      readBy: { [sender]: true }, // 보낸 사용자의 읽음 상태 추가
      files
    };

    try {
      const sentMessage = await sendMessageService(selectedChatRoomId, newMessageData);
      setMessages((prevMessages) => {
        const messageExists = prevMessages.some(msg => msg.id === sentMessage.id);
        return messageExists ? prevMessages : [...prevMessages, sentMessage];
      });
      setNewMessage("");
      setFiles([]); // 메시지 전송 후 파일 초기화
    } catch (error) {
      console.error(error);
      alert('메시지 전송 중 오류가 발생했습니다.'); // 사용자에게 알림
    }
  };


  // CKEditor의 onChange 이벤트를 통해 입력된 메시지 업데이트
  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData(); // CKEditor의 데이터를 가져옴
    setNewMessage(data); // 입력된 데이터를 newMessage 상태로 업데이트
  };

  const toggleEmojiPicker = () => {
    setShowEmojis((prev) => !prev);
  };

  // 이모티콘 선택 핸들러 함수
  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prevMessage) => prevMessage + emoji);
  };



  const handleDelete = async () => {
    if (selectChatRooms.length === 0) {
      alert("삭제할 채팅방을 선택해주세요.");
      return;
    }
    if (window.confirm("선택한 채팅방을 삭제하시겠습니까?")) {
      try {
        await deleteChatRoomsService(selectChatRooms);
        alert("채팅방이 삭제되었습니다.");
        setChatRooms(prevChatRooms =>
          prevChatRooms.filter(room => !selectChatRooms.includes(room.id))
        );
        setSelectChatRooms([]);
      } catch (error) {
        console.error('Delete operation failed:', error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const filteredChatRooms = chatRooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //===========================================여기 까지 serviceInsertReply,api 끝!!!!=============================================

  const handleCreateChatRoom = async (e: React.FormEvent) => {
    e.preventDefault(); // 페이지 새로고침 방지

    // ChatRoom 객체 생성
    const newChatRoom: any = {
      name: chatRoomName, // 입력된 채팅방 이름
      participants: [...participantNames, newParticipantName.trim()], // 초기 참가자 목록에 입력된 참가자 추가
    };

    // 참가자 목록 체크
    const participantsList = newChatRoom.participants.length > 0
      ? newChatRoom.participants.join(", ")
      : "참가자가 없습니다"; // 참가자가 없을 경우 기본 메시지

    const result = await insertChatRoom(newChatRoom);

    if (result.status === 200) {
      alert("채팅방이 성공적으로 생성되었습니다.");
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        fetchData(parsedUser.nickname); // user.nickname으로 파라미터 전달
      }
    }

    // 채팅방 이름과 참가자 목록 초기화
    setChatRoomName(""); // 채팅방 이름 초기화
    setNewParticipantName(""); // 입력 필드 초기화
  };

  const handleCheck = (roomId: string) => {
    // 선택된 채팅방 ID가 이미 배열에 존재하면 제거, 없으면 추가
    setSelectChatRooms((prevSelectedRooms) =>
      prevSelectedRooms.includes(roomId)
        ? prevSelectedRooms.filter((id) => id !== roomId)
        : [...prevSelectedRooms, roomId]
    );
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>냠냠</title>
        <meta name="author" content="Templines" />
        <meta name="description" content="TeamHost" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="shortcut icon" href="/assets/img/favicon.png" type="image/x-icon" />

        {/* CSS Files */}
        <link rel="stylesheet" href="/assets/css/libs.min.css" />
        <link rel="stylesheet" href="/assets/css/main.css" />

        {/* Google Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Marcellus&display=swap" rel="stylesheet" />
      </Head>
      <main className="page-main">
        <h3 className="uk-text-lead">Chats</h3>

        <div className="chat-room-create">
          <form onSubmit={handleCreateChatRoom}>
            <div>
              <label>채팅방 이름: </label>
              <input
                type="text"
                value={chatRoomName}
                onChange={(e) => setChatRoomName(e.target.value)}
                placeholder="채팅방 이름을 입력하세요"
              />
            </div>
            <div>
              <label>참가자 닉네임: </label>
              <input
                type="text"
                value={newParticipantName}
                onChange={(e) => setNewParticipantName(e.target.value)}
                placeholder="참가자 닉네임을 입력하세요"
              />
            </div>
            <button type="submit">채팅방 생성</button>
          </form>
          <div style={{ marginBottom: '20px' }}>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg"
            >
              선택한 채팅방 삭제
            </button>
          </div>
        </div>

        <div className="uk-grid uk-grid-small" data-uk-grid>
          <div className="uk-width-1-3@l">
            <div className="chat-user-list">
              <div className="chat-user-list__box" style={{ width: '90%' }}>
                <div className="chat-user-list__head">
                  <div className="avatar">
                    <Image src="/assets/img/profile.png" alt="profile" width={40} height={40} />
                  </div>
                </div>
                <div className="chat-user-list__search">
                  <div className="search">
                    <div className="search__input">
                      <i className="ico_search"></i>
                      <input
                        type="search"
                        name="search"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="chat-user-list__body">
                  <ul>
                    {filteredChatRooms.map((room) => (
                      <li key={room.id}>
                        <div className="user-item --active">
                          <div className="user-item__avatar">
                            <Image src="/assets/img/user-list-1.png" alt="user" width={40} height={40} />
                          </div>
                          <div className="user-item__desc" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (room && room.id) {
                                  setSelectedChatRoomId(room.id);
                                }
                              }}
                              style={{ textDecoration: 'none', color: 'inherit', flexGrow: 2, marginRight: '10px' }}
                            >
                              <div className="user-item__name">
                                {room.name}
                              </div>
                            </a>
                            <div style={{ flexGrow: 1, flexShrink: 1, textAlign: 'right', marginRight: '10px', maxWidth: '150px' }}>
                              {room.participants && room.participants.length > 0 ? (
                                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                  {room.participants.map((participant: string, index: number) => (
                                    <li key={index} style={{ marginLeft: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', maxWidth: '100%', width: 'auto' }}>
                                      {participant || "No Nickname"}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                "No Participants"
                              )}
                            </div>
                          </div>
                          <div className="user-item__info" style={{ marginLeft: 'auto' }}>
                            <input
                              type="checkbox"
                              checked={selectChatRooms.includes(room.id)}
                              onChange={(e) => handleCheck(room.id)}
                            />
                            {/* 안 읽은 메시지 수 표시 */}
                            <span style={{ marginLeft: '5px', color: 'red' }}>{room.unreadCount} unread</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="uk-width-2-3@l">
            <div className="chat-messages-box">
              <div className="chat-messages-head">
                {selectedChatRoomId ? (
                  <div className="user-item">
                    <div className="user-item__avatar">
                      <Image src="/assets/img/user-list-4.png" alt="user" width={40} height={40} />
                    </div>
                    <div className="user-item__desc" style={{ width: 'full' }}>
                      <div className="user-item__name" style={{ textAlign: 'center', fontSize: '1.5rem' }}>
                        {filteredChatRooms.find(room => room.id === selectedChatRoomId)?.name || "Unknown Room"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <h3>선택된 채팅방이 없습니다.</h3>
                )}
              </div>
              {selectedChatRoomId ? (
                <>
                  <div className="chat-messages-body flex-1 overflow-y-auto p-4 bg-white shadow-md rounded-lg space-y-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`w-full messages-item ${msg.sender !== sender ? '--your-message' : '--friend-message'} flex`}
                      >
                        <div className="messages-item__avatar flex items-center mr-2">
                          {msg.sender !== sender ? (
                            <Image src="/assets/img/user-list-3.png" alt="img" width={40} height={40} />
                          ) : (
                            <Image src="/assets/img/user-list-4.png" alt="img" width={40} height={40} />
                          )}
                        </div>
                        <div className="flex flex-col justify-start">
                          <div className="flex items-center">
                            <p className="text-sm font-semibold">{msg.sender}</p>
                          </div>
                          <div className="messages-item__text">{msg.message}</div>
                          {msg.sender !== sender ? (
                            <div className="messages-item__time text-gray-500 text-xs">{new Date(msg.createdAt).toLocaleTimeString()}</div>
                          ) : (
                            <div className="messages-item__time text-gray-500 text-xs ml-auto">{new Date(msg.createdAt).toLocaleTimeString()}</div>
                          )}
                          {/* 안 읽은 메시지 수 표시 */}
                          {countNotReadParticipants(msg) > 0 && (
                            <span style={{ color: 'red', fontSize: '0.8em' }}>
                              {countNotReadParticipants(msg)} unread
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                  </div>
                  <div className="chat-messages-footer">
                    <form onSubmit={sendMessage} className="chat-messages-form flex mt-4">
                      <div className="chat-messages-form-controls flex-grow">
                        {/* 이모지 선택 버튼 */}
                        <button
                          type="button"
                          onClick={toggleEmojiPicker} // 버튼 클릭 시 이모지 창 표시/숨김 토글
                          className="emoji-picker-button px-2 py-1 rounded-md mr-2 border"
                        >
                          😊
                        </button>

                        {/* 이모지 선택 창 표시 여부에 따라 렌더링 */}
                        {showEmojis && (
                          <div className="absolute bottom-16 left-0 z-50">
                            <EmojiPicker onSelectEmoji={handleEmojiSelect} />
                          </div>
                        )}

                        {/* ClassicEditor 적용 */}
                        <CKEditor
                          editor={ClassicEditor}
                          data={newMessage}
                          onChange={handleEditorChange}
                          config={{
                            ckfinder: {
                              uploadUrl: 'http://localhost:8081/api/chats/uploads',
                            },
                            placeholder: '메시지를 입력하세요...',
                          }}
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
