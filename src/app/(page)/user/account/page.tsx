"use client";
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { User } from "@/app/model/user.model";
import nookies from "nookies";
import Link from "next/link";
import { fetchDeleteFollow, fetchIsFollow, fetchRegisterFollow } from "@/app/service/follow/follow.service";
import { FollowModel } from "@/app/model/follow.model";
import { checkChatRoom, insertChatRoom } from '@/app/api/chatRoom/chatRoom.api';
import { useRouter } from 'next/navigation';
import Modal from '@/app/components/Modal';

interface AccountProps {
    user: User;
}

interface Users {
    nickname: string;
    username: string;
    role: string;
    score: string;
}

export default function Account(user: Partial<AccountProps>) {
    const [users, setUsers] = useState<Users | null>(null);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const cookie = nookies.get();
    const userId = cookie.userId;
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("")

    const router = useRouter();  // 페이지 이동을 위한 라우터


    useEffect(() => {

        if (userId && user.user) {
            const username = localStorage.getItem('username');
            const nickname = localStorage.getItem('nickname');
            const role = localStorage.getItem('role');
            const score = localStorage.getItem('score')

            if (username && nickname && role && score) {
                const storedUser = {
                    username,
                    nickname,
                    role,
                    score
                };
                setUsers(storedUser);
            }

            const checkFollowStatus = async () => {
                const followingUser = user?.user.nickname;
                const result = await fetchIsFollow(followingUser, nickname);
                setIsFollowing(result);
            };

            checkFollowStatus();
        }


    }, [userId, user])

    const handleFollow = async () => {
        const followModel: FollowModel = {
            id: 0,
            follower: user?.user.nickname,
            following: users.nickname,
        };

        try {
            await fetchRegisterFollow(followModel);
            setIsFollowing(true);
        } catch (error) {
            console.error("Failed to follow:", error);
        }
    };

    const handleUnfollow = async () => {

        const follower = user?.user.nickname
        const following = users.nickname


        try {
            await fetchDeleteFollow(follower, following);
            setIsFollowing(false);
        } catch (error) {
            console.error('Failed to unfollow:', error);
        }
    };



    const handleCreateChatRoom = async (e: React.FormEvent) => {
        e.preventDefault();

        const newChatRoom: any = {
            name: "님과의 채팅방",
            participants: [users.nickname, user.user.nickname],
        };

        const checkResult = await checkChatRoom(newChatRoom);

        if (checkResult.status === 200 && checkResult.data) {
            const existingChatRoom = checkResult.data;
            const id = existingChatRoom.id;
            router.push(`/chatRoom/${id}`);
        } else {
            const createResult = await insertChatRoom(newChatRoom);

            if (createResult.status === 200 && createResult.data) {
                setAlertMessage("채팅방이 생성되었습니다.");
                setAlertOpen(true);

                const createdChatRoom = createResult.data;
                const id = createdChatRoom.id;
                router.push(`/chatRoom/${id}`);
            } else {
                console.error("채팅방 생성 실패", createResult);
                setAlertMessage("채팅방 생성 중 오류가 발생했습니다.");
                setAlertOpen(true);
            }
        }
    };

    return (
        <div className="w-full lg:pr-[5px] md:pr-[5px]">
            <div className="user-infor bg-surface lg:px-7 px-4 lg:py-10 py-5 md:rounded-[20px] rounded-xl">
                <div className="heading flex flex-col items-center justify-center">
                    <div className="avatar">
                        <Image
                            src={'/assets/img/profile.png'}
                            width={300}
                            height={300}
                            alt='avatar'
                            className='md:w-[140px] w-[120px] md:h-[140px] h-[120px] rounded-full'
                        />
                    </div>
                    <div className="name heading6 mt-4 text-left">{user?.user?.nickname}</div>
                    <div className="mail heading6 font-normal normal-case text-secondary mt-1 text-sm text-left">
                        냠냠온도: {user?.user?.score}
                    </div>
                </div>
                <div className="menu-tab w-full max-w-none lg:mt-10 mt-6">
                    <div className="item flex items-center gap-3 w-full px-5 py-4 rounded-lg">
                        <h5 className="heading6"></h5>
                    </div>
                </div>
                {
                    user.user?.id === userId ? (
                        <Link href="/user/follow" passHref>
                            <button type="submit"
                                className="px-4 py-2 bg-[#41B3A3] text-white rounded hover:bg-[#178E7F]">
                                팔로우
                            </button>
                        </Link>
                    ) : isFollowing ? (
                        <button
                            onClick={handleUnfollow}
                            className="px-4 py-2 bg-[#41B3A3] text-white rounded hover:bg-[#178E7F]">
                            언팔로우
                        </button>
                    ) : (
                        <button onClick={handleFollow}
                            className="px-4 py-2 bg-[#41B3A3] text-white rounded hover:bg-[#178E7F]">
                            팔로우하기
                        </button>
                    )
                }
                <button
                    className="px-4 py-2 ml-4 bg-[#3A9181] text-white rounded hover:bg-[#2C7365]"
                    onClick={handleCreateChatRoom}
                >
                    채팅하기
                </button>
                <Modal isOpen={alertOpen} onClose={() => setAlertOpen(false)}>
                    <div className="p-4 text-center mt-5">
                        <h3 className="font-semibold text-lg">{alertMessage}</h3>
                        <button
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-200"
                            onClick={() => setAlertOpen(false)}
                        >
                            확인
                        </button>
                    </div>
                </Modal>

            </div>
        </div>
    );
}
