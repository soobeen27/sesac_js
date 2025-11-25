const myBtn = document.getElementById("myButton");
myBtn.addEventListener("click", () => {
    console.log("clicked!");
});

// 1.DOM 가져온다
// 2. 원하는 이벤트 등록
// 3. 그 이벤트가 발생했을때 처리할 콜백함수 등록
// 4. 그럼 이벤트가 발생햇을때 그 함수로 이어져 실행(비동기)
