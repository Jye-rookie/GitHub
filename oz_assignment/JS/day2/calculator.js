// 계산기 상태 관리를 위한 변수들
let displayValue = '0';  // 화면에 표시될 값
let isPowerOn = true;    // ON/OFF 상태 (기본값: 켜짐) 초기화면에서 켜져있는걸 보여주고 싶다. 

// 화면 요소를 가져오기.
// 입력창과 전원버튼의 동적 변경이 필요하므로 두 요소만 가져온다.
// 숫자와 연산자는 html에서 onclick에 각자의 역할이 포함되어있어서 따로 설정할 필요 없다. 

// 숫자나 연산자를 입력하면 화면에 표시되야 하고, 계산 결과도 나타내야 한다.
const display = document.getElementById('display');

// 전원의 온오프를 색상 및 화면으로 나타내야한다.
const toggleButton = document.querySelector('.on-off');


// 1. 화면 업데이트 함수 - 화면에 보이는 상태를 계속 업데이트해야하므로 함수를 만든다.
function updateDisplay() {
    if (!isPowerOn) {
        display.value = ''; // 전원이 꺼져있으면 빈 화면
    } else {
        // display 클래스의 value 메서드를 계속 불러오는건 자바가 html을 직접 건드리는 것 = 무거운 작업 
        // 변수로 지정해서 사용.
        display.value = displayValue; 
       
    }
}

// 2. ON/OFF 버튼 함수
// togglePower: 클릭 이벤트가 있을 때 실행되는 함수  
function togglePower() {
    isPowerOn = !isPowerOn; // 버튼 누르면, 상태 반전: on -> off (기본이 on)
    
    if (isPowerOn) { // 켜짐 상태일때, 디스플레이에 0이 나오고 버튼 색이 켜짐 색 (회색)이 된다.
        displayValue = '0';
        toggleButton.classList.remove('on'); // 버튼 색을 바꾸기 위해 css에서 정의한 .on-off.on(초록색)을 제거.
    } else { // 꺼짐 상태일때, 디스플레이에 별도 표시 없고, 버튼색이 꺼짐색(초록색)이 된다. 
        displayValue = '';
        toggleButton.classList.add('on'); // 버튼 색을 바꾸기 위해 css에서 정의한 .on-off.on(초록색)을 더함.
    }
    updateDisplay();
}

// 3. C (Clear) 버튼 함수
function clearDisplay() {
    if (!isPowerOn) return; // 전원이 꺼져있으면 작동 안 함 = early return 설정
    
    displayValue = '0'; // 화면에 표시되는 값을 0으로 만든다 = 초기화
    updateDisplay(); //display.value에 반영한다. = 실제 화면에 보여준다. 
}

// 4. 숫자 및 마침표(.) 입력 함수
function appendNumber(number) {
    if (!isPowerOn) return; 
    
    // 현재 화면이 '0'이고 새로 입력한 값이 마침표('.')가 아니라면 '0'을 지우고 시작
    if (displayValue === '0' && number !== '.') {
        displayValue = number;
    } else {
        // 마침표(.)가 중복으로 들어가지 않도록 방지 (소수점 유효성 체크)        
        if (number === '.') {
            // 화면에 표시된 숫자를 [\+\-\*\/] 를 기준으로 쪼개라는 의미.
            const parts = displayValue.split(/[\+\-\*\/]/);
            // 잘라낸 숫자의 갯수 -1 = parts의 인덱스로 실제 숫자를 찾는다.  
            const currentNumber = parts[parts.length - 1];
            // 찾은 실제 숫자가 .을 포함하고 있을때, .가 추가로 포함되면 return으로 종료, 아니면 계속.
            if (currentNumber.includes('.')) return; 
        }
        displayValue += number;
    }
    updateDisplay();
}

// 5. 연산자 (+, -, *, /) 입력 함수
function appendOperator(operator) {
    if (!isPowerOn) return; 
    
    // 연산자를 연속으로 눌렀을 때 수식정리하기 위한 조건

    // 입력된 가장 마지막 글자 확인
    const lastChar = displayValue.slice(-1);
    
    // 만약 lastChar가 이미 연산자라면, 
    if (['+', '-', '*', '/'].includes(lastChar)) {
        // 표시된 값의 처음~마지막 직전까지 값을 가져오고 연산자를 붙여라 = 마지막만 떼어낸다음 연산자를 붙여라.  
        // 연산자가 중복되면 마지막에 입력된 연산자를 남기겠다는 뜻
        displayValue = displayValue.slice(0, -1) + operator;
    } else {
        displayValue += operator;
    }
    updateDisplay();
}

// 6. Enter 버튼 함수 
function performCalculate() {
    if (!isPowerOn) return;
    
    // 수식이 비어있거나 연산자로 끝나는 경우 계산 방지
    if (displayValue === '' || ['+', '-', '*', '/'].includes(displayValue.slice(-1))) return;

    try {
        // [단계 1] 문자열 수식을 숫자 배열과 연산자 배열로 쪼개기        
        // 연산자로 나눠낸 "숫자"를 문자열 -> 실수로 바꿔라 -> 숫자만 남음
        const numbers = displayValue.split(/[\+\-\*\/]/).map(num => parseFloat(num));
        // 숫자와 마침표를 기준으로 자라낸 연산자에서 빈칸이 아닌 연산자를 걸러내라. -> 연산자만 남음
        const operators = displayValue.split(/[0-9\.]+/).filter(op => op !== '');

        // [단계 2] 곱셈(*)과 나눗셈(/) 먼저 처리하기 (수학의 사칙연산 우선순위)
        for (let i = 0; i < operators.length; i++) {
            if (operators[i] === '*' || operators[i] === '/') {
                const currentOp = operators[i];
                const num1 = numbers[i];
                const num2 = numbers[i + 1];
                let tempResult = 0;

                if (currentOp === '*') tempResult = num1 * num2;
                if (currentOp === '/') {
                    if (num2 === 0) throw new Error("DivideByZero"); // 0으로 나누기 방지
                    tempResult = num1 / num2;
                }

                // 계산한 결과값으로 숫자 배열을 교체하고, 사용한 연산자는 삭제합니다.
                numbers.splice(i, 2, tempResult);
                operators.splice(i, 1);
                i--; // 배열이 한 칸씩 당겨졌으므로 인덱스를 조절합니다.
            }
        }

        // [단계 3] 남은 덧셈(+)과 뺄셈(-) 순서대로 처리하기
        let result = numbers[0];
        for (let i = 0; i < operators.length; i++) {
            const currentOp = operators[i];
            const nextNum = numbers[i + 1];

            if (currentOp === '+') result += nextNum;
            if (currentOp === '-') result -= nextNum;
        }

        // [단계 4] 부동소수점 오차 해결 및 화면 표시
        if (!Number.isInteger(result)) {
            result = parseFloat(result.toFixed(12));
        }

        displayValue = String(result);

    } catch (error) {
        displayValue = 'Error';
    }
    
    updateDisplay();
}