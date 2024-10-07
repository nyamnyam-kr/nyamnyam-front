// import { User } from '@/app/model/user.model'; // User 인터페이스 가져오기
// import { registerUser } from '@/app/api/user/user.api';
// import { faker } from '@faker-js/faker';
//
// // User 생성 함수 (MongoDB에서 id는 선택적)
// const generateRandomUser = (): User => {
//     const randomGender = faker.datatype.boolean() ? 'female' : 'male';
//     const randomTel = `010-${faker.number.int({ min: 1000, max: 9999 })}-${faker.number.int({ min: 1000, max: 9999 })}`; // 010-xxxx-xxxx 형식으로 전화번호 생성
//
//     return {
//         username: faker.internet.userName(),
//         password: `password${faker.number.int({ min: 1, max: 1000 })}`, // password 필드는 "password{번호}" 형식으로
//         nickname: faker.internet.userName(),
//         name: faker.name.fullName(),
//         age: faker.number.int({ min: 12, max: 79 }), // 나이 설정
//         tel: randomTel,                             // 직접 생성한 010-####-#### 형식의 전화번호
//         gender: randomGender,                       // 성별은 'male' 또는 'female'
//         enabled: true,                              // enabled는 기본적으로 true
//         role: 'USER',                               // role은 'USER'로 고정
//         imgId: null,                                // imgId는 null로 기본 설정
//     };
// };
//
// // 여러 명의 사용자 등록 함수 (썸네일 없이)
// export const registerMultipleUsers = async (count: number): Promise<void> => {
//     for (let i = 1; i <= count; i++) {
//         const user = generateRandomUser();
//
//         try {
//             const registeredUser = await registerUser(user, []); // 썸네일 없이 빈 배열 전달
//             console.log(`Successfully registered user: ${registeredUser.username}`);
//         } catch (error) {
//             console.error('Error registering user:', error);
//         }
//     }
// };
//
// "use client";
// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from "next/link";
// import { addUser } from "@/app/service/user/user.service";
// import { registerMultipleUsers } from "@/app/service/register-users"
//
// export default function Register() {
//     const router = useRouter();
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [nickname, setNickname] = useState('');
//     const [name, setName] = useState('');
//     const [age, setAge] = useState<number | string>('');
//     const [tel, setTel] = useState('');
//     const [gender, setGender] = useState('');
//     const [thumbnail, setThumbnail] = useState<File | null>(null);
//     const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리
//
//     const isValidPhoneNumber = (phone: string) => {
//         const regex = /^\d{3}-\d{4}-\d{4}$/;
//         return regex.test(phone);
//     };
//
//     const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         const errors = [];
//
//         if (!username) errors.push("Username은 필수 입력입니다.");
//         if (!password) errors.push("Password는 필수 입력입니다.");
//         if (!nickname) errors.push("Nickname은 필수 입력입니다.");
//         if (!name) errors.push("Name은 필수 입력입니다.");
//         if (!age) errors.push("Age는 필수 입력입니다.");
//         if (!tel) errors.push("전화번호는 필수 입력입니다.");
//         if (!gender) errors.push("성별은 필수 입력입니다.");
//         if (!isValidPhoneNumber(tel)) {
//             errors.push('전화번호는 000-0000-0000 형식이어야 합니다.');
//         }
//
//         if (errors.length > 0) {
//             alert(errors.join('\n'));
//             return;
//         }
//
//         try {
//             const newUser = await addUser(username, password, nickname, name, age, tel, gender, thumbnail ? [thumbnail] : []);
//             console.log('User registered:', newUser);
//             router.push("/user/login");
//         } catch (error) {
//             console.error('Registration failed:', error);
//             alert('회원가입에 실패했습니다. 다시 시도해주세요.');
//         }
//     };
//
//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files && event.target.files.length > 0) {
//             setThumbnail(event.target.files[0]);
//         }
//     };
//
//     const handleRegister50Users = async () => {
//         setIsLoading(true); // 로딩 상태로 설정
//         await registerMultipleUsers(50); // 50명 등록 함수 호출
//         setIsLoading(false); // 로딩 상태 해제
//         alert('50명의 사용자가 성공적으로 등록되었습니다!');
//     };
//
//     return (
//         <div className="register-block md:py-20 py-10 mt-10" style={{ borderRadius: '20px', overflow: 'hidden', backgroundColor: '#f9f9f9' }}>
//             <div className="container">
//                 <div className="content-main flex gap-y-8 max-md:flex-col p-5">
//                     <div className="left md:w-1/2 w-full lg:pr-[60px] md:pr-[40px] md:border-r border-line">
//                         <div className="heading4">Register</div>
//                         <form onSubmit={handleRegister} className="md:mt-7 mt-4">
//                             <div className="email">
//                                 <input
//                                     className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
//                                     id="username"
//                                     type="text"
//                                     placeholder="Username *"
//                                     value={username}
//                                     onChange={(e) => setUsername(e.target.value)}
//                                     required
//                                 />
//                             </div>
//                             <div className="pass mt-5">
//                                 <input
//                                     className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
//                                     id="password"
//                                     type="password"
//                                     placeholder="Password *"
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     required
//                                 />
//                             </div>
//                             <div className="nickname mt-5">
//                                 <input
//                                     className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
//                                     id="nickname"
//                                     type="text"
//                                     placeholder="Nickname *"
//                                     value={nickname}
//                                     onChange={(e) => setNickname(e.target.value)}
//                                     required
//                                 />
//                             </div>
//                             <div className="name mt-5">
//                                 <input
//                                     className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
//                                     id="name"
//                                     type="text"
//                                     placeholder="Name *"
//                                     value={name}
//                                     onChange={(e) => setName(e.target.value)}
//                                     required
//                                 />
//                             </div>
//                             <div className="age mt-5">
//                                 <input
//                                     className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
//                                     id="age"
//                                     type="number"
//                                     placeholder="Age *"
//                                     value={age}
//                                     onChange={(e) => setAge(e.target.value)}
//                                     required
//                                 />
//                             </div>
//                             <div className="tel mt-5">
//                                 <input
//                                     className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
//                                     id="tel"
//                                     type="text"
//                                     placeholder="전화번호 (000-0000-0000) *"
//                                     value={tel}
//                                     onChange={(e) => setTel(e.target.value)}
//                                     required
//                                 />
//                             </div>
//                             <div className="gender mt-5">
//                                 <select
//                                     className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
//                                     id="gender"
//                                     value={gender}
//                                     onChange={(e) => setGender(e.target.value)}
//                                     required
//                                 >
//                                     <option value="">성별 선택</option>
//                                     <option value="male">Male</option>
//                                     <option value="female">Female</option>
//                                 </select>
//                             </div>
//                             <div className="thumbnails mt-5">
//                                 <label htmlFor="thumbnail-upload" className="button-main">썸네일 추가</label>
//                                 <input
//                                     type="file"
//                                     id="thumbnail-upload"
//                                     accept="image/*"
//                                     onChange={handleFileChange}
//                                     style={{ display: 'none' }}
//                                 />
//                                 {thumbnail && <p>{thumbnail.name} 선택됨</p>}
//                             </div>
//                             <div className="block-button md:mt-7 mt-4">
//                                 <button type="submit" className="button-main">Register</button>
//                             </div>
//                         </form>
//                     </div>
//                     <div className="right md:w-1/2 w-full lg:pl-[60px] md:pl-[40px] flex items-center">
//                         <div className="text-content">
//                             <div className="heading4">Already have an account?</div>
//                             <div className="mt-2 text-secondary">Welcome back. Sign in to access your personalized experience, saved preferences, and more. We're thrilled to have you with us again!</div>
//                             <div className="block-button md:mt-7 mt-4">
//                                 <Link href={'/login'} className="button-main">Login</Link>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {/* 50명 등록 버튼 추가 */}
//                 <div className="block-button md:mt-7 mt-4">
//                     <button onClick={handleRegister50Users} className="button-main" disabled={isLoading}>
//                         {isLoading ? 'Registering 50 users...' : 'Register 50 Users'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
