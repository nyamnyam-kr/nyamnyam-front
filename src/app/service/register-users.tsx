// import { User } from '@/app/model/user.model'; // User 인터페이스 가져오기
// import { faker } from '@faker-js/faker';
// import { addUser } from '@/app/service/user/user.service'; // addUser 서비스 가져오기
//
// // User 생성 함수 (MongoDB에서 id는 선택적)
// const generateRandomUser = (): User => {
//     const randomGender = faker.datatype.boolean() ? 'female' : 'male';
//     const randomTel = `010-${faker.number.int({ min: 1000, max: 9999 })}-${faker.number.int({ min: 1000, max: 9999 })}`; // 010-xxxx-xxxx 형식으로 전화번호 생성
//     const randomUsername = faker.internet.userName(); // username과 password를 동일하게 설정
//
//     return {
//         username: randomUsername,
//         password: randomUsername, // password를 username과 동일하게 설정
//         nickname: faker.internet.userName(),
//         name: faker.name.fullName(),
//         age: faker.number.int({ min: 15, max: 69 }) ?? 18, // null인 경우 기본값 18 설정
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
//             const registeredUser = await addUser(
//                 user.username,
//                 user.password,
//                 user.nickname,
//                 user.name,
//                 user.age ?? 18, // null일 경우 기본값 18로 처리
//                 user.tel,
//                 user.gender,
//                 [] // 썸네일 없이 빈 배열 전달
//             );
//             console.log(`Successfully registered user: ${registeredUser.username}`);
//         } catch (error) {
//             console.error('Error registering user:', error);
//         }
//     }
// };
