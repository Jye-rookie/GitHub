const API_URL = "https://api4.binance.com/api/v3/ticker/24hr";
const STORAGE_KEY = "favoriteCoins"; // 로컬스토리지에 관심항목 저장해두려고 사용. 관심표시하면 기억해둬야 하니까

const tableBody = document.querySelector("#coinTableBody");
const searchInput = document.querySelector("#searchInput");
const allTab = document.querySelector("#allTab");
const favoriteTab = document.querySelector("#favoriteTab");
const totalCount = document.querySelector("#totalCount");
const favoriteCount = document.querySelector("#favoriteCount");
const updatedAt = document.querySelector("#updatedAt");
const statusText = document.querySelector("#statusText");
const emptyMessage = document.querySelector("#emptyMessage");

let coins = []; // API에서 받아온 코인 목록 전체를 담는 array
let currentTab = "all";  // 전체보기 탭 
// 관심항목으로 추가된 코인 심볼을 담는 array
// 관심항목은 storage_key에서 가져오거나 비우기 =>관심 항목 있으면 저장소에서 꺼내오고, 없으면 빈칸 or 빈화면
// JSON.parse: json을 꺼내올 때 배열로 바꿔라
let favorites = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// 관심항목 저장하기. favotires는 array 이므로 json으로변경해서 저장소에 저장
function saveFavorites() { 
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

// API에서 받은 가격 문자열(보통은 숫자를 문자열로 보낸다)을 숫자형식으로 바꾸기
// Number: js 내장함수. 
// maximumFractionDigits: 소수점 최대 자리수 설정
// Number(price) >= 1 ? 4 : 8 삼항연산자. 가격이 1 이상이면 소수점 최대 4자리, 아니면 8자리 
function formatPrice(price) {
  return Number(price).toLocaleString("en-US", {
    maximumFractionDigits: Number(price) >= 1 ? 4 : 8,
  });
}

// 검색창 + 탭 상태 반영해서 보여줄 코인만 골라내는 함수 
function getFilteredCoins() {
  // 검색창에 검색어를 입력하면, trim으로 앞뒤 공백 지우고, toUpperCase로 대문자변환
  const keyword = searchInput.value.trim().toUpperCase();

  // 전체 코인 목록에서 조건에 맞는 코인정보만 남긴다.   
  return coins.filter((coin) => {
    // 현재 코인이 관심항목에 있는가? 참/거짓으로 표시
    // coin.symbol: 코인이름
    const isFavorite = favorites.includes(coin.symbol);
    // 현재 탭이 전체보기 or 관심항목 보기?
    const matchesTab = currentTab === "all" || isFavorite;
    // 코인 심볼에 검색어가 포함되어 있나? 몇글자만 검색해도 나오게 하는 설정
    const matchesSearch = coin.symbol.includes(keyword);
    // 탭조건과 검색 조건이 맞으면 결과를 보여라
    return matchesTab && matchesSearch;
  });
}
// 랜더링 하는 함수 
function renderCoins() {
  const filteredCoins = getFilteredCoins();
  
  // html에서 비워뒀던 tbody 부분
  tableBody.innerHTML = filteredCoins.map((coin) => {
    const isFavorite = favorites.includes(coin.symbol); // 변수가 같아도 함수가 다르면 공유 못함
    const change = Number(coin.priceChangePercent); //변동률 숫자로 바꾸기
    const changeClass = change >= 0 ? "up" : "down"; // 상승, 하락 클래스 정하기. 변화가 0이상이면 up, 아니면 down
    
    // 코인 데이터 객체를 HTML 문자열로 바꾸는 방식. html의 테이블 목록 순서대로 . 
    return `
      <tr>
        <td>
         <button class="favorite ${isFavorite ? "on" : ""}" data-symbol="${coin.symbol}">
            ★
          </button>
        </td>
        <td>${coin.symbol}</td> 
        <td>$${formatPrice(coin.lastPrice)}</td> 
        <td class="${changeClass}">${change.toFixed(2)}%</td>
        <td>$${formatPrice(coin.highPrice)}</td>
        <td>$${formatPrice(coin.lowPrice)}</td>
        
        <td>${Number(coin.quoteVolume).toLocaleString()}</td>
      </tr>
    `;
  }).join(""); //innerHTML에는 하나의 긴 문자열을 넣어야해서 join으로 결과를 하나로 붙여준다. 

  // 요약 정보 업뎃. html에서 info 클래스에 있는 항목
  totalCount.textContent = coins.length;
  favoriteCount.textContent = favorites.length;
  emptyMessage.hidden = filteredCoins.length > 0;
}

// 비동기 동작 함수. API 요청이 시간이 걸리기 때문에 비동기로 작업
async function fetchCoins() {
  try {
    const response = await fetch(API_URL); // 응답이 올 때까지 기다렸다가 다음줄로-

    if (!response.ok) {
      throw new Error("API 요청 실패");
    }

    const data = await response.json(); // response에서 데이터오면, json으로 바꿔서 정리해라

    coins = data // API 요청이 성공하면 coins에 데이터가 들어간다. 
      .filter((coin) => coin.symbol.endsWith("USDT"))
      .sort((a, b) => Number(b.quoteVolume) - Number(a.quoteVolume));

    statusText.textContent = "실시간 업데이트 중";
    updatedAt.textContent = new Date().toLocaleTimeString("ko-KR");

    renderCoins();
  } catch (error) {
    if (coins.length > 0) {
      statusText.textContent = "업데이트 재시도 중...";
    } else {
      statusText.textContent = "데이터를 불러오지 못했습니다.";
    }

    console.error(error);
  }
}

// 클릭 이벤트 넣기
tableBody.addEventListener("click", (event) => {
  if (!event.target.classList.contains("favorite")) return; // early return

  const symbol = event.target.dataset.symbol;

  if (favorites.includes(symbol)) {
    favorites = favorites.filter((item) => item !== symbol);
  } else {
    favorites.push(symbol);
  }

  saveFavorites();
  renderCoins();
});

searchInput.addEventListener("input", renderCoins);

// 전체보기를 클릭하면 전체목록을 보여주기
allTab.addEventListener("click", () => {
  currentTab = "all";
  allTab.classList.add("active");
  favoriteTab.classList.remove("active");
  renderCoins();
});

// 관심항목 보기를 클릭하면 관심항목을 보여주기 
favoriteTab.addEventListener("click", () => {
  currentTab = "favorites";
  favoriteTab.classList.add("active");
  allTab.classList.remove("active");
  renderCoins();
});

fetchCoins();
setInterval(fetchCoins, 3000);