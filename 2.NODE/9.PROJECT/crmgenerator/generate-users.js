const randomAddress = require("./random-address");
const randomValueFrom = require("./random-value-from");

const crypto = require("crypto");

const generateUsers = (count) => {
    let userArray = [];
    for (let i = 0; i < count; i++) {
        userArray.push(generateUser());
    }
    return userArray;
};

const randomGender = () => {
    return Math.random() > 0.5 ? "Male" : "Female";
};

const randomDate = () => {
    const startDate = new Date(1980, 0, 1).getTime();
    const endDate = new Date(2010, 0, 1).getTime();

    const randTime = Math.random() * (endDate - startDate) + startDate;
    return new Date(randTime);
};

const randomDateStr = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const getAge = (bod) => {
    const bornYear = bod.getFullYear();
    const now = new Date().getFullYear();
    return now - bornYear;
};

const generateUser = () => {
    const id = crypto.randomUUID();
    const gender = randomGender();
    const firstName =
        gender === "Male"
            ? randomValueFrom(maleNames)
            : randomValueFrom(femaleNames);
    const lastName = randomValueFrom(lastNames);
    const birthDate = randomDate();
    const birthDateStr = randomDateStr(birthDate);
    const age = getAge(birthDate);
    const address = randomAddress();
    const user = {
        id: id,
        name: `${lastName}${firstName}`,
        gender: gender,
        age: age,
        birthDate: birthDateStr,
        address: address,
    };
    return user;
};

const maleNames = [
    "서준",
    "민준",
    "도윤",
    "시우",
    "예준",
    "하준",
    "지호",
    "주원",
    "지후",
    "도현",
    "준우",
    "준서",
    "건우",
    "우진",
    "현우",
    "선우",
    "지훈",
    "유준",
    "은우",
    "연우",
    "서진",
    "이준",
    "시윤",
    "민재",
    "현준",
    "정우",
    "윤우",
    "수호",
    "지우",
    "승우",
    "유찬",
    "지환",
    "이안",
    "승현",
    "준혁",
    "시후",
    "진우",
    "승민",
    "민성",
    "수현",
    "지원",
    "준영",
    "시현",
    "재윤",
    "은호",
    "우주",
    "지한",
    "태윤",
    "한결",
    "지안",
    "시온",
    "서우",
    "윤호",
    "시원",
    "은찬",
    "민우",
    "재원",
    "동현",
    "이현",
    "하진",
    "민규",
    "우빈",
    "민찬",
    "재민",
    "율",
    "로운",
    "하율",
    "도하",
    "지율",
    "준호",
    "윤재",
    "준",
    "태민",
    "성민",
    "재현",
    "지민",
    "하민",
    "민호",
    "승준",
    "현서",
    "성현",
    "예성",
    "하람",
    "태오",
    "지성",
    "태현",
    "이든",
    "규민",
    "태양",
    "민혁",
    "다온",
    "성준",
    "윤성",
    "정민",
    "도훈",
    "주안",
    "은성",
    "예찬",
    "지오",
    "주호",
];

const femaleNames = [
    "서윤",
    "서연",
    "지우",
    "하윤",
    "서현",
    "하은",
    "민서",
    "지유",
    "윤서",
    "채원",
    "수아",
    "지아",
    "지민",
    "서아",
    "지윤",
    "지안",
    "다은",
    "은서",
    "하린",
    "예은",
    "예린",
    "소율",
    "수빈",
    "소윤",
    "유나",
    "예원",
    "지원",
    "시은",
    "채은",
    "시아",
    "윤아",
    "아린",
    "유진",
    "예나",
    "아윤",
    "예서",
    "가은",
    "연우",
    "유주",
    "하율",
    "주아",
    "예진",
    "다인",
    "서영",
    "민지",
    "서우",
    "연서",
    "수민",
    "아인",
    "수연",
    "나은",
    "서은",
    "채윤",
    "서하",
    "시연",
    "서율",
    "나윤",
    "채아",
    "하연",
    "다연",
    "지율",
    "현서",
    "유빈",
    "다현",
    "소은",
    "이서",
    "서진",
    "예지",
    "사랑",
    "수현",
    "나연",
    "세아",
    "지은",
    "은채",
    "시현",
    "다윤",
    "예빈",
    "주하",
    "지수",
    "민주",
    "윤지",
    "채린",
    "다온",
    "소연",
    "지현",
    "소민",
    "승아",
    "유하",
    "하영",
    "혜원",
    "소이",
    "세은",
    "리아",
    "민아",
    "서희",
    "나현",
    "도연",
    "아영",
    "윤슬",
    "아현",
];

const lastNames = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임"];

module.exports = generateUsers;
