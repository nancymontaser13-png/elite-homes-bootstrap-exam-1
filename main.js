document.addEventListener("DOMContentLoaded", () => {
  /* ========== 1) FAQ Accordion ========== */
  // HTML: <div class="faq-item"><button class="faq-question">...</button><div class="faq-answer">...</div></div>
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // اقفلي كل الأسئلة التانية
      faqItems.forEach((other) => {
        other.classList.remove("open");
        other.querySelector(".faq-answer").style.maxHeight = null;
      });

      // افتحي الحالي لو كان مقفول
      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ========== 2) Contact Form ========== */
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = contactForm.querySelector("#name").value.trim();
      const email = contactForm.querySelector("#email").value.trim();
      const message = contactForm.querySelector("#message").value.trim();
      const agree = contactForm.querySelector("#agree");

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !emailOk || message.length < 10) {
        alert("Please enter your name, a valid email, and a message (10+ characters).");
        return;
      }

      console.log({ name, email, message, marketing: agree ? agree.checked : false });
      alert("Thank you, " + name + "! Your message has been sent.");
      contactForm.reset();
    });
  }

  /* ========== 3) Property Search ========== */
  const properties = [
    { title: "Modern Condo", city: "New York", type: "condo", price: 450000, beds: 2, baths: 2, sqft: 1200 },
    { title: "Luxury Estate", city: "Los Angeles", type: "house", price: 2500000, beds: 5, baths: 4, sqft: 4800 },
    { title: "Cozy Apartment", city: "Chicago", type: "apartment", price: 280000, beds: 1, baths: 1, sqft: 850 },
    { title: "Family House", city: "Miami", type: "house", price: 750000, beds: 4, baths: 3, sqft: 2600 },
  ];

  const searchForm = document.getElementById("searchForm");
  const results = document.getElementById("results");
  const isAny = (v) => !v || /^(any|all)/i.test(v);

  function inPrice(price, range) {
    if (isAny(range)) return true;
    if (range.endsWith("+")) return price >= parseInt(range);
    const [min, max] = range.split("-").map(Number);
    return price >= min && price <= max;
  }

  if (searchForm && results) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const loc = document.getElementById("location").value.trim().toLowerCase();
      const type = document.getElementById("propertyType").value;
      const price = document.getElementById("priceRange").value;
      const beds = document.getElementById("bedrooms").value;
      const baths = document.getElementById("bathrooms").value;
      const minSq = parseInt(document.getElementById("minSqft").value) || 0;
      const maxSq = parseInt(document.getElementById("maxSqft").value) || Infinity;

      if (minSq > maxSq) return alert("Min Sq Ft must be less than Max Sq Ft");

      const list = properties.filter(
        (p) =>
          (!loc || p.city.toLowerCase().includes(loc)) &&
          (isAny(type) || p.type === type) &&
          inPrice(p.price, price) &&
          (isAny(beds) || p.beds >= parseInt(beds)) &&
          (isAny(baths) || p.baths >= parseInt(baths)) &&
          p.sqft >= minSq &&
          p.sqft <= maxSq
      );

      results.innerHTML = list.length
        ? list
            .map(
              (p) => `
          <div class="col-md-4 mb-3">
            <div class="card bg-dark text-light h-100"><div class="card-body">
              <h5>${p.title}</h5>
              <p>${p.city} • ${p.type}</p>
              <p>🛏 ${p.beds} 🛁 ${p.baths} 📐 ${p.sqft.toLocaleString()} sq ft</p>
              <strong>$${p.price.toLocaleString()}</strong>
            </div></div>
          </div>`
            )
            .join("")
        : `<p class="text-center text-light">No properties found.</p>`;
    });
  }

  /* ========== 4) Navbar: active link + smooth scroll ========== */
  const navLinks = document.querySelectorAll(".navbar .nav-link[href^='#']");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // تفعيل اللينك حسب مكان السكرول
  const sections = [...navLinks]
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  window.addEventListener("scroll", () => {
    const y = window.scrollY + 120;
    sections.forEach((sec, i) => {
      if (sec.offsetTop <= y && sec.offsetTop + sec.offsetHeight > y) {
        navLinks.forEach((l) => l.classList.remove("active"));
        navLinks[i].classList.add("active");
      }
    });
  });
});