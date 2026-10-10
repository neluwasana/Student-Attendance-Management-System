document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("sparkleContainer");
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  for (let i = 0; i < 50; i++) {
    createSparkle();
  }

  function createSparkle() {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";

    const startX = Math.random() * containerWidth;
    const startY = Math.random() * containerHeight;

    const tx = (Math.random() - 0.5) * 100;
    const ty = (Math.random() - 0.5) * 100;
    const tx2 = tx + (Math.random() - 0.5) * 50;
    const ty2 = ty + (Math.random() - 0.5) * 50;

    const delay = Math.random() * 5;
    const duration = 2 + Math.random() * 3;

    sparkle.style.left = `${startX}px`;
    sparkle.style.top = `${startY}px`;
    sparkle.style.setProperty("--tx", `${tx}px`);
    sparkle.style.setProperty("--ty", `${ty}px`);
    sparkle.style.setProperty("--tx2", `${tx2}px`);
    sparkle.style.setProperty("--ty2", `${ty2}px`);
    sparkle.style.animationDelay = `${delay}s`;
    sparkle.style.animationDuration = `${duration}s`;

    container.appendChild(sparkle);

    sparkle.addEventListener("animationend", function () {
      sparkle.style.left = `${Math.random() * containerWidth}px`;
      sparkle.style.top = `${Math.random() * containerHeight}px`;
      sparkle.style.animationDelay = "0s";
      sparkle.style.animationDuration = `${2 + Math.random() * 3}s`;
    });
  }
});

document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  const whatsappUrl = `https://wa.me/+94755021040?text=Name: ${encodeURIComponent(
    name
  )}%0AEmail: ${encodeURIComponent(email)}%0AMessage: ${encodeURIComponent(
    message
  )}`;
  window.open(whatsappUrl, "_blank");

  alert(
    `Message would be sent to your phone:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
  );

  this.reset();
});

function closeForgotPassword() {
  window.location.href = "Cards.html";
}
