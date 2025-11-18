document.addEventListener("DOMContentLoaded", () => {
  /* ===========================
     Loading Screen Animation
  ============================ */
  let progress = 0;
  const progressFill = document.getElementById("progress-fill");
  const progressPercentage = document.getElementById("progress-percentage");
  const progressMessage = document.querySelector(".progress-message");
  const loadingScreen = document.getElementById("loading-screen");

  const messages = [
    "Preparing Portfolio...",
    "Loading Assets...",
    "Optimizing Experience...",
    "Almost Ready...",
  ];

  const interval = setInterval(() => {
    progress += 1;
    progressFill.style.width = progress + "%";
    progressPercentage.textContent = progress + "%";

    if (progress % 25 === 0 && progress < 100) {
      progressMessage.textContent = messages[Math.floor(progress / 25)];
    }

    if (progress >= 100) {
      clearInterval(interval);
      loadingScreen.classList.add("fade-out");
      setTimeout(() => {
        loadingScreen.classList.add("hidden");
      }, 600);
    }
  }, 40);

  /* ===========================
     Smooth Scroll Navigation
  ============================ */
  document.querySelectorAll("#sidebar-nav a").forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* ===========================
     Scroll Spy
  ============================ */
  // const sections = document.querySelectorAll("section");
  // const navLinks = document.querySelectorAll("#sidebar-nav a");

  // const observerOptions = {
  //   threshold: 0.5,
  // };

  // const observer = new IntersectionObserver((entries) => {
  //   entries.forEach((entry) => {
  //     if (entry.isIntersecting) {
  //       navLinks.forEach((link) => link.classList.remove("active"));
  //       const activeLink = document.querySelector(
  //         `#sidebar-nav a[href="#${entry.target.id}"]`
  //       );
  //       if (activeLink) activeLink.classList.add("active");
  //     }
  //   });
  // }, observerOptions);

  // sections.forEach((section) => observer.observe(section));

  // /* ===========================
  //    Mobile Sidebar Toggle
  // ============================ */
  // const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  // const sidebar = document.getElementById("sidebar-nav");
  // const mainContent = document.querySelector(".main-content");

  // if (mobileMenuBtn) {
  //   mobileMenuBtn.addEventListener("click", (e) => {
  //     e.stopPropagation();
  //     sidebar.classList.toggle("open");
  //     mainContent.classList.toggle("sidebar-open");
  //   });
  // }

  // document.addEventListener("click", (e) => {
  //   if (
  //     sidebar.classList.contains("open") &&
  //     !sidebar.contains(e.target) &&
  //     !mobileMenuBtn.contains(e.target)
  //   ) {
  //     sidebar.classList.remove("open");
  //     mainContent.classList.remove("sidebar-open");
  //   }
  // });

  // navLinks.forEach((link) => {
  //   link.addEventListener("click", () => {
  //     if (window.innerWidth <= 768) {
  //       sidebar.classList.remove("open");
  //       mainContent.classList.remove("sidebar-open");
  //     }
  //   });
  // });

  /* ===========================
     Robot Face Mouse Tracking
  ============================ */
  const face = document.querySelector(".face");

  window.addEventListener("mousemove", (e) => {
    if (!face) return;

    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;

    face.style.transform = `translate(${x}px, ${y}px)`;
  });

  /* ===========================
     FAQ Toggle
  ============================ */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
      item.classList.toggle("active");
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);

      if (target) {
        // Smooth scroll to section
        target.scrollIntoView({ behavior: "smooth", block: "start" });

        // Wait 2 seconds before highlight starts
        setTimeout(() => {
          // Remove existing highlight (if any)
          target.classList.remove("section-blink");
          void target.offsetWidth; // restart animation

          // Add highlight
          target.classList.add("section-blink");

          // Remove it after blinking finishes
          setTimeout(() => {
            target.classList.remove("section-blink");
          }, 2000);
        }, 1000); // delay after scroll
      }
    });
  });
  /*SCRIPT FOR CONTACT FORM*/
  let isSubmitting = false;

  document
    .getElementById("contactForm")
    .addEventListener("submit", function (e) {
      e.preventDefault(); // Stop page reload

      if (isSubmitting) return; // Prevent double submission

      const form = e.target;
      const formData = new FormData(form);
      const statusMsg = document.getElementById("statusMsg");

      // Basic form validation
      const name = form.querySelector('input[name="name"]').value.trim();
      const email = form.querySelector('input[name="email"]').value.trim();
      const message = form
        .querySelector('textarea[name="message"]')
        .value.trim();

      if (!name || !email || !message) {
        statusMsg.textContent = "❌ Please fill in all required fields.";
        statusMsg.style.color = "red";
        return;
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        statusMsg.textContent = "❌ Please enter a valid email address.";
        statusMsg.style.color = "red";
        return;
      }

      isSubmitting = true;
      statusMsg.textContent = "⏳ Sending message...";
      statusMsg.style.color = "gold";

      // Initialize EmailJS
      (function () {
        emailjs.init("IVCEvi1ga6bpQ7ZL2"); // replace with your public key
      })();

      // Send via EmailJS first
      emailjs.sendForm("service_qan1lfl", "template_gft3otk", this).then(
        () => {
          // If EmailJS succeeds, save to Google Sheet
          fetch(
            "https://script.google.com/macros/s/AKfycbz-KBzI3V09M7yWZUwZ5TogsYPpf0M0A0k5_IWGRNuIJuG3lbbtYTJ2WHPVaeYveZZ6DA/exec" /*Replace with google sheet link*/,
            {
              method: "POST",
              body: formData,
            }
          )
            .then((response) => response.text())
            .then((data) => {
              statusMsg.textContent = "✅ Message sent & saved!";
              statusMsg.style.color = "green";
              form.reset(); // Clear form
              isSubmitting = false;
            })
            .catch((error) => {
              statusMsg.textContent = "❌ Failed to save to sheet.";
              statusMsg.style.color = "red";
              console.error(error);
              isSubmitting = false;
            });
        },
        (error) => {
          statusMsg.textContent = "❌ Email sending failed!";
          statusMsg.style.color = "red";
          console.error(error);
          isSubmitting = false;
        }
      );
    });

  // Show button when scrolling down
  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 5000) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });

  // Scroll back to top smoothly
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const line1 = "Hi, I'm an";
  const line2 = "Web Designer &";
  const line3 = "E-commerce Specialist";

  const typingHi = document.getElementById("typing-hi");
  const typingTitle = document.getElementById("typing-title");
  const secondTitle = document.getElementById("secondTitle");

  let index1 = 0;
  let index2 = 0;
  let index3 = 0;
  let forward = true; // typing forward or deleting

  function typeWriter() {
    if (forward) {
      // Typing forward
      if (index1 < line1.length) {
        typingHi.textContent += line1.charAt(index1);
        index1++;
      } else if (index2 < line2.length) {
        typingTitle.textContent += line2.charAt(index2);
        index2++;
      } else if (index3 < line3.length) {
        secondTitle.textContent += line3.charAt(index3);
        index3++;
      } else {
        forward = false; // switch to deleting
        setTimeout(typeWriter, 1000); // pause before deleting
        return;
      }
    } else {
      // Deleting backward
      if (index3 > 0) {
        secondTitle.textContent = line3.substring(0, index3 - 1);
        index3--;
      } else {
        forward = true; // switch to typing again
        setTimeout(typeWriter, 500); // pause before typing
        return;
      }
    }

    setTimeout(typeWriter, 100); // typing/deleting speed
  }

  window.addEventListener("DOMContentLoaded", typeWriter);

  const btn = document.querySelector(".view-more-btn");
  const hiddenCards = document.querySelectorAll(".hidden-card");

  btn.addEventListener("click", () => {
    const isExpanded = btn.textContent.includes("Less");

    hiddenCards.forEach((card) => {
      if (isExpanded) {
        card.classList.remove("show"); // hide
      } else {
        card.classList.add("show"); // show
      }
    });

    btn.textContent = isExpanded ? "View More" : "View Less";
  });
});
