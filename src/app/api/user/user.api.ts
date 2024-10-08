
import { User } from "src/app/model/user.model";
import {customFetch} from "@/app/service/user/fetchClient";


const fetchUserExists = async (id: string): Promise<boolean> => {
    const response = await fetch(`http://localhost:8081/api/user/existsById?id=${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user existence');
    }
    return response.json();
};

const fetchUserById = async (id: string): Promise<User> => {
    const response = await fetch(`http://localhost:8081/api/user/findById?id=${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user by ID');
    }
    return response.json();
};

const fetchAllUsers = async (): Promise<User[]> => {
    const response = await fetch(`http://localhost:8081/api/user/findAll`);
    if (!response.ok) {
        throw new Error('Failed to fetch all users');
    }
    return response.json();
};

const fetchUserCount = async (): Promise<number> => {
    const response = await fetch(`http://localhost:8081/api/user/count`);
    if (!response.ok) {
        throw new Error('Failed to fetch user count');
    }
    return response.json();
};

const deleteUserById = async (id: string): Promise<void> => {
    const response = await fetch(`http://localhost:8081/api/user/deleteById?id=${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete user');
    }
};

const updateUser = async (user: User): Promise<User> => {
    const response = await fetch(`http://localhost:8081/api/user/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        throw new Error('Failed to update user');
    }
    return response.json();
};

const registerUser = async (user: User, thumbnails: File[]): Promise<User> => {
    const formData = new FormData();
    formData.append('user', new Blob([JSON.stringify(user)], { type: 'application/json' }));

    thumbnails.forEach((thumbnail, index) => {
        formData.append(`thumbnails`, thumbnail);
    });

    const response = await fetch(`http://localhost:8081/api/user/join`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to register user');
    }
    return response.json();
};



const loginUser = async (username: string, password: string): Promise<string> => {
    const response = await fetch(`http://localhost:8081/api/user/login?username=${username}&password=${password}`, {
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error('Failed to log in');
    }


    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data.token;
    } else {
        return response.text();
    }
};
const uploadThumbnailApi = async (thumbnails: File[]): Promise<number[]> => {
    const formData = new FormData();
    thumbnails.forEach(thumbnail => {
        formData.append('images', thumbnail);
    });

    const response = await fetch('http://localhost:8081/api/thumbnails/upload', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload thumbnails');
    }

    const data = await response.json();
    return data.imgIds;
};

const refreshTokenApi = async (oldToken: string): Promise<string> => {
    const response = await fetch(`http://localhost:8081/api/token/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldToken }),
    });

    if (!response.ok) {
        throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    return data;
};

// logoutApi에서 customFetch 사용
export const logoutApi = async (): Promise<void> => {
    const token = localStorage.getItem('token'); // localStorage에서 토큰 가져오기

    // 로그아웃 요청을 customFetch를 통해 호출
    await customFetch(`http://localhost:8081/api/token/logout`, {
        method: 'POST',
        body: JSON.stringify({ token }), // 바디에 토큰을 포함하여 전달
    });
};


const checkUsernameExists = async (username: string): Promise<boolean> => {
    const response = await fetch(`http://localhost:8081/api/user/check-username?username=${username}`);
    if (!response.ok) {
        throw new Error('Failed to check username existence');
    }
    return response.json();
};

export const UserApi = {
    fetchUserExists,
    fetchUserById,
    fetchAllUsers,
    fetchUserCount,
    deleteUserById,
    updateUser,
    registerUser,
    loginUser,
    uploadThumbnailApi,
    refreshTokenApi,
    logoutApi,
    checkUsernameExists
};


