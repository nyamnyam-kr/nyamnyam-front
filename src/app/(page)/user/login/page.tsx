"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginSuccess, setLoginSuccess] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:8080/user/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    username,
                    password
                })
            });

            if (!response.ok) {
                throw new Error('로그인 실패');
            }

            setLoginSuccess(true);
            alert('로그인 성공! 홈으로 이동합니다.');
            router.push('/'); // 로그인 성공 후 홈으로 이동
        } catch (error) {
            console.error('로그인에 문제가 발생했습니다:', error);
            alert('로그인 실패: 아이디와 비밀번호를 확인해주세요.');
        }
    };

    const moveToJoin = () => {
        router.push('/user/join'); // 회원 가입 페이지로 이동
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-2xl mb-6">로그인</h1>
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
            <button
                onClick={handleLogin}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
                로그인
            </button>
            <button
                onClick={moveToJoin}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
            >
                회원 가입
            </button>
        </main>
    );
}
