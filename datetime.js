// 날짜와 시간을 업데이트하는 함수
function updateDateTime() {
  const now = new Date();
  const dateStr = now.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  document.getElementById("date").textContent = dateStr;
  document.getElementById("time").textContent = timeStr;
}

// 페이지가 로드되면 현재 날짜와 시간을 업데이트하고 매 초마다 갱신합니다.
window.onload = function () {
  updateDateTime();
  setInterval(updateDateTime, 1000);
};
