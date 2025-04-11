document.addEventListener("DOMContentLoaded", () => {
  console.log("Page loaded, JavaScript is running!");
  // Add your JS code below here

  const testimonialcontainer = document.querySelector("#testimonial-container");

  let hasNext = true;
  let afterID = null;
  let isFetching = false;
  const limit = 5;

  // Data fetching fra API
  function fetchData() {
    // Stop dobelt fetch eller fetch med manglende data
    if (!hasNext || isFetching) return;

    isFetching = true;

    // Loading SVG
    testimonialcontainer.innerHTML += `
    <div class="loading">
      <svg class="loading-svg" xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
      <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
      <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
      </svg>
    </div>`;

    let apiURL = `https://api.frontendexpert.io/api/fe/testimonials?limit=${limit}`;
    if (afterID !== null) {
      apiURL += `&after=${afterID}`;
    }

    fetch(`https://corsproxy.io/?url=${encodeURIComponent(apiURL)}`)
      .then((response) => response.json())
      .then((data) => {
        const loadingDiv = document.querySelector(".loading");
        if (loadingDiv) loadingDiv.remove();

        if (data.testimonials.length > 0) {
          afterID = data.testimonials[data.testimonials.length - 1].id;
        } else {
          afterID = null;
        }

        hasNext = data.hasNext;
        isFetching = false;
        renderTestimonials(data.testimonials);
      })
      .catch((error) => {
        console.error("Fejl", error);
        const loadingDiv = document.querySelector(".loading");
        if (loadingDiv) loadingDiv.remove();
        isFetching = false;
      });
  }

  // Rendering af testimonials data fra API
  function renderTestimonials(testimonials) {
    const testimonialBox = testimonials
      .map(
        (testimonial) => `
          <div class="testimonial">
            <div>
              <img class="img" src="https://picsum.photos/65/65?random=${Math.random()}" alt="testimonial picture">
            </div>
            <div class="text">
             <p class="name">${testimonial.id}</p>
             <p class="message">${testimonial.message}</p>
            </div>
          </div>`
      )
      .join("");
    testimonialcontainer.innerHTML += testimonialBox;
  }

  // Scroll listener => fetcher mere data når man scroller til bunden
  testimonialcontainer.addEventListener("scroll", () => {
    if (testimonialcontainer.scrollTop + testimonialcontainer.clientHeight >= testimonialcontainer.scrollHeight - 10) {
      fetchData();
    }
  });

  fetchData();
});
