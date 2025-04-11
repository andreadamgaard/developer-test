document.addEventListener("DOMContentLoaded", () => {
  console.log("Page loaded, JavaScript is running!");

  // Add your JS code below here
  const cryptoTable = document.querySelector(".crypto-data");
  const backBt = document.querySelector(".backBt");
  const nextBt = document.querySelector(".nextBt");

  let allData = [];
  let currentPage = 1;
  const coinsPerPage = 10;
  const totalPages = 3;

  // fetch data fra API
  function fetchData() {
    const APIurl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false&locale=en";

    fetch(APIurl)
      .then((response) => response.json())
      .then((data) => {
        allData = data;
        renderTable(currentPage);
        updateBtns();
      })
      .catch((error) => {
        console.error("Fejl", error);
        cryptoTable.innerHTML = `<tr><td colspan="3">Fejl med data loading</td></tr>`;
      });
  }

  // Render data fra API i table
  function renderTable(page) {
    const start = (page - 1) * coinsPerPage;
    const end = start + coinsPerPage;
    const visibleCoins = allData.slice(start, end);

    cryptoTable.innerHTML = visibleCoins
      .map(
        (coin) =>
          `
          <tr>
          <th scope="row">
            <div class="coin">
              <img src=${coin.image} alt=${coin.id}>
                <span class="coin-txt">
                  <b class="symbol">${coin.symbol}</b>
                  <p class="name">${coin.name}</p>
                </span>
            </div>
          </th>
          
          <td>
          <div class="price">
            <div class="current-price">
              <b>${coin.current_price.toFixed(2)}</b>
            </div>
            <div class="high-low">
                <span class="price-high-low">H: ${coin.high_24h.toFixed(2)}
                </span>
                <span class="price-high-low">L: ${coin.low_24h.toFixed(2)}
                </span>
                </div>
            </div>
          </td>

        <td class="market">
          <b>${Intl.NumberFormat("en-US").format(coin.market_cap)}</td></b>
      </tr>
      `
      )
      .join("");
  }

  // Updater knapper efter side
  function updateBtns() {
    if (currentPage === 1) {
      backBt.classList.add("disabled");
    } else {
      backBt.classList.remove("disabled");
    }

    if (currentPage === totalPages) {
      nextBt.classList.add("disabled");
    } else {
      nextBt.classList.remove("disabled");
    }
  }

  // Knapper skifter side
  nextBt.addEventListener("click", () => {
    currentPage++;
    renderTable(currentPage);
    updateBtns();
  });

  backBt.addEventListener("click", () => {
    currentPage--;
    renderTable(currentPage);
    updateBtns();
  });

  fetchData();
});
