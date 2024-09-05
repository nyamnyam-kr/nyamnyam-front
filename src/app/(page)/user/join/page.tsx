"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [name, setName] = useState("");
    const [tel, setTel] = useState("");
    const [gender, setGender] = useState("");
    const [registrationSuccess, setRegistrationSuccess] = useState(false);  // 회원가입 성공 여부
    const router = useRouter();

    const handleRegister = async () => {
        try {
            const response = await fetch('http://211.188.50.33:8080/user/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    nickname,
                    name,
                    tel,
                    gender,
                    grade: 1,  // 기본 등급
                    role: "ROLE_USER",  // 기본 역할
                    enabled: true  // 활성화 여부
                })
            });

            if (!response.ok) {
                throw new Error('회원가입 실패');
            }

            // 회원가입 성공 처리
            setRegistrationSuccess(true);
            alert('회원가입이 완료되었습니다.');
        } catch (error) {
            console.error('회원가입에 문제가 발생했습니다:', error);
            alert('회원가입 실패: 다시 시도해주세요.');
        }
    };

    const goToLogin = () => {
        router.push('/user/login');
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-2xl mb-6">회원 가입</h1>

            {!registrationSuccess ? (
                <>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">아이디</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">닉네임</label>
                        <input
                            type="text"
                            id="nickname"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">이름</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="tel" className="block text-sm font-medium text-gray-700">전화번호</label>
                        <input
                            type="text"
                            id="tel"
                            value={tel}
                            onChange={(e) => setTel(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">성별</label>
                        <select
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="">성별 선택</option>
                            <option value="M">남성</option>
                            <option value="F">여성</option>
                        </select>
                    </div>
                    <button
                        onClick={handleRegister}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        회원가입
                    </button>
                </>
            ) : (
                <div className="flex flex-col items-center">
                    <p className="text-lg font-bold text-green-600 mb-4">가입이 완료되었습니다!</p>
                    <button
                        onClick={goToLogin}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        확인
                    </button>
                </div>
            )}
        </main>
    );
}
