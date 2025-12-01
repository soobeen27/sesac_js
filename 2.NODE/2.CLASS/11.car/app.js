// Car를 상속받은 세단, suv 도 있음

const SUV = require("./SUV");
const Parent = require("./Parent");
const Child = require("./Child");

const dadCar = new SUV("테슬라", "Model X", false);

//Person을 상속받은 Parent, Child 있음
const dad = new Parent("빌 게이츠", 40, "남성", "회사원");
const son = new Child("빌 주니어", 20, "남성", "대학생");

//사람이 차를 타는 함수
dad.getInCar(dadCar);
son.getInCar(dadCar);

// 차에는 움직이는 함수 구현
dadCar.start();
dadCar.autoPilot("미술관");
son.playInCar();
dadCar.stop();
