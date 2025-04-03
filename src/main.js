const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let arrow = document.getElementById("arrow");

let width = canvas.width;
let height = canvas.height;

const exceptArray = [];
let devide = []; //나눌 갯수 입니다
const degree = 360; //원은 360도..ㅋ
let goalDegree = 270 + degree / devide.length / 2; // 한 칸의 절반만큼 조정

function buildDevideArray(exceptValue) {
  devide.splice(0, devide.length); //기존에 있던 데이터는 삭제합니다
  for (let i = 0; i < 120; i++) {
    if (!exceptValue.includes(i)) {
      devide.push(i);
    }
  }
}

//랜덤숫자 반환 함수 입니다
function getRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const colorCode = ["red", "black", "green"];

let data = [];

function buildDataArray() {
  data.splice(0, data.length); //기존에 있던 데이터는 삭제합니다
  for (let i = 0; i < devide.length; i++) {
    let json = {
      first: (degree / devide.length) * i,
      last: (degree / devide.length) * (i + 1),
      text: devide[i] + 1,
      color: colorCode[i % 3],
    };
    data.push(json);
  }
  goalDegree = 270 + degree / devide.length / 2;
}

buildDevideArray(exceptArray);
buildDataArray();
//각도를 라디안으로 계산합니다
function degreesToRadians(degrees) {
  const pi = Math.PI;
  return degrees * (pi / 180);
}

let gradient = ctx.createRadialGradient(
  width / 2,
  height / 2,
  100,
  width / 2,
  height / 2,
  width
);

//그리는 함수 입니다
function drawing(todo) {
  if (!todo && isWorking) return; //동작중인 상태에서 호출되지 않게 합니다
  ctx.clearRect(0, 0, width, height);

  // **1. 배경 그라디언트 추가**

  data.map((item, index) => {
    //부채꼴을 그립니다
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "white";

    ctx.fillStyle = item.color;
    //ctx.fillStyle = item.color;
    ctx.moveTo(width / 2, height / 2);
    ctx.arc(
      width / 2,
      height / 2,
      width * 0.497,
      (Math.PI / 180) * item.first,
      (Math.PI / 180) * item.last,
      false
    );
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    //글씨를 넣습니다
    ctx.save();
    let half = Math.abs(item.first - item.last) / 2;
    let degg = item.first + half;
    let xx =
      ((Math.cos(degreesToRadians(degg)) * width) / 2) * 0.95 + width / 2;
    let yy =
      ((Math.sin(degreesToRadians(degg)) * width) / 2) * 0.95 + height / 2; // 글씨 위치를 좀 더 위로
    let minus = ctx.measureText(item.text).width / 2 + 1;
    ctx.fillStyle = "white";
    ctx.font = "normal 11px sans-serif";
    ctx.fillText(item.text, xx - minus, yy);
    ctx.restore();
    if (todo) todo(item); //콜백이 있으면 실행하여 줍니다

    return item;
  });

  //가운데 원
  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.fillStyle = "black";
  ctx.strokeStyle = "white";
  ctx.arc(width / 2, height / 2, 150, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
  ctx.restore();

  //내부 테두리
  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "white";
  ctx.arc(width / 2, height / 2, width * 0.46, 0, 2 * Math.PI, false);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();

  //외부 테두리
  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "white";
  ctx.arc(width / 2, height / 2, width * 0.498, 0, 2 * Math.PI, false);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}

function runCircle(calback) {
  let int = 1; //각도 증감용 숫자
  let time = 10; //회전속도
  let count = 0; //정점용 숫자(count번 돌고 randomNum갯수에 다다르면 멈춤)
  let randomNum = getRandomNumberBetween(350, 400); //멈출 횟수를 정합니다
  function innerLooper() {
    if (count > randomNum) {
      arrow.style.transition = "transform 0.6s ease-out"; // 멈출 때 부드럽게 복귀
      arrow.style.transform = "translateX(-40%) rotate(0deg)";
      if (calback) calback(randomNum); //다 돌면 콜백 함수를 호출 합니다
      return;
    }
    setTimeout(() => {
      drawing((item) => {
        //그립니다
        item.first = item.first + int;
        item.last = item.last + int;
      });
      let tilt = getRandomNumberBetween(5, 10); // 기울기 정도 키움
      let direction = -tilt; // 좌우로 흔들리게 함
      arrow.style.transform = `transform 2.5s ease-out`;
      arrow.style.transform = `translateX(-40%) rotate(${direction}deg)`; // 🔄 왼쪽/오른쪽 번갈아 기울이기
      if (count < 220) {
        if (time > 1) time -= 0.2;
      } else {
        if (time < 50) time += 0.1;
      }
      count += 1;
      innerLooper(); //재귀호출
    }, time);
  }
  innerLooper();
}

let isWorking = false;
function goStart() {
  if (isWorking) return;
  isWorking = true;

  const winnerMother = document.getElementById("winner");
  winnerMother.children[0].remove(); //기존에 있던 데이터는 삭제합니다

  buildDevideArray(exceptArray);
  buildDataArray();
  runCircle(() => {
    let { first } = data[0];
    let cnt = 0;
    while (first > goalDegree) {
      first -= degree;
      cnt += 1;
    }

    let result = null;
    data.forEach((item) => {
      let findFirst = item.first - degree * cnt;
      let findLast = item.last - degree * cnt;
      if (findFirst < goalDegree && goalDegree < findLast) {
        result = item;
      }
    });
    isWorking = false;
    if (result.text) {
      const newChild = document.createElement("div");
      newChild.textContent = `${result.text}번, `;
      document.getElementById("result").appendChild(newChild);
      document.getElementById("total-size").textContent = `total ${
        document.getElementById("result").childNodes.length
      }개`;
      exceptArray.push(Number(result.text) - 1); //제외할 숫자에 추가합니다
      const winnerMother = document.getElementById("winner");
      const winnerChild = document.createElement("div");
      winnerChild.textContent = `${result.text}번`;
      winnerChild.classList.add("winner-text");
      winnerMother.appendChild(winnerChild);
      setTimeout(() => {
        winnerChild.remove();
        const readyText = document.createElement("div");
        readyText.textContent = "BUBAUM";
        readyText.classList.add("ready-text");
        winnerMother.appendChild(readyText);
      }, 3000);
    }
  });
}

drawing();

/////반짝 원
function randomColor() {
  const colors = [
    "255, 255, 0",
    "255, 165, 0",
    "0, 255, 255",
    "255, 0, 255",
    "173, 216, 230",
    "255, 192, 203",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function createRandomLights(count) {
  const container = document.body; // 조명을 추가할 부모 요소
  for (let i = 0; i < count; i++) {
    const light = document.createElement("div");
    light.classList.add("light");

    // 랜덤 위치 설정 (화면 전체)
    const randomX = Math.random() * 99; // 0 ~ 100% (vw)
    const randomY = Math.random() * 99; // 0 ~ 100% (vh)

    // 랜덤 크기 설정 (40px ~ 100px)
    const randomSize = Math.floor(Math.random() * 60) + 20;

    // 랜덤 애니메이션 시작 시간 (0초 ~ 2초)
    const randomDelay = Math.random() * 2;

    const color = randomColor();
    light.style.background = `radial-gradient(circle, rgba(${color}, 0.8) 10%, rgba(${color}, 0) 70%)`;

    // 스타일 적용
    light.style.left = `${randomX}%`;
    light.style.top = `${randomY}%`;
    light.style.width = `${randomSize}px`;
    light.style.height = `${randomSize}px`;
    light.style.animationDelay = `${randomDelay}s`; // 각 조명의 깜빡이는 타이밍을 다르게

    container.appendChild(light);
  }
}

// 10개의
createRandomLights(70);
