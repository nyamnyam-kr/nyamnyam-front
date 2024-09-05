"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Register() {
    const [cityData, setCityData] = useState<CityModel[]>([]);
    const router = useRouter();

    let moveToSave = () => {
        router.push("/city/register");
    };

    let moveToLogin = () => {
        router.push("/user/login"); // 로그인 페이지로 이동
    };

    useEffect(() => {
        fetch("http://223.130.155.121:8080/user")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setCityData(data);
            })
            .catch((error) => {
                console.error("There has been a problem with your fetch operation:", error);
            });
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <button onClick={moveToSave} className="bg-blue-500 active:bg-blue-600 py-2 px-4 rounded text-white">
                Go Save
            </button>
            <button onClick={moveToLogin} className="bg-green-500 active:bg-green-600 py-2 px-4 rounded text-white mt-4">
                Go to Login
            </button>
            <table className="table-auto border border-orange-500 mt-8">
                <thead>
                <tr className="border border-orange-500">
                    <th>번호</th>
                    <th>도시 이름</th>
                </tr>
                </thead>
                <tbody>
                {cityData.map((city) => (
                    <tr className="border border-orange-500" key={city.id}>
                        <td>{city.id}</td>
                        <td>{city.cityName}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </main>
    );
}
