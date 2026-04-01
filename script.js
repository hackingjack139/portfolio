const yearElement = document.querySelector("#year");
const revealElements = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const matrixCanvas = document.querySelector(".matrix-rain");
const glowGroupSelectors = [
  ".mini-grid",
  ".proof-strip",
  ".cards-grid",
  ".pricing-grid",
  ".process-grid",
  ".work-grid",
  ".testimonial-grid",
  ".niches-grid",
  ".faq-grid",
  ".feature-list"
];
const staggerGroups = document.querySelectorAll(
  ".mini-grid, .cards-grid, .pricing-grid, .process-grid, .work-grid, .testimonial-grid, .niches-grid, .faq-grid, .feature-list, .trust-tags"
);

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

if (matrixCanvas && !prefersReducedMotion.matches) {
  const context = matrixCanvas.getContext("2d");
  const glyphs = "01010101ABCDEF<>[]{}";
  const drops = [];
  let animationFrame = 0;
  let columns = 0;
  let fontSize = 16;
  let width = 0;
  let height = 0;

  const resizeMatrix = () => {
    const ratio = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    matrixCanvas.width = Math.floor(width * ratio);
    matrixCanvas.height = Math.floor(height * ratio);
    matrixCanvas.style.width = `${width}px`;
    matrixCanvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    fontSize = width < 720 ? 12 : 16;
    columns = Math.ceil(width / fontSize);
    drops.length = 0;

    for (let index = 0; index < columns; index += 1) {
      drops.push({
        x: index * fontSize,
        y: Math.random() * -height,
        speed: 0.8 + Math.random() * 1.6,
        length: 8 + Math.floor(Math.random() * 18)
      });
    }
  };

  const drawMatrix = () => {
    context.clearRect(0, 0, width, height);
    context.fillStyle = "rgba(6, 9, 14, 0.08)";
    context.fillRect(0, 0, width, height);
    context.font = `600 ${fontSize}px "Space Grotesk", monospace`;
    context.textAlign = "center";

    drops.forEach((drop, index) => {
      for (let trailIndex = 0; trailIndex < drop.length; trailIndex += 1) {
        const y = drop.y - trailIndex * fontSize;

        if (y < -fontSize || y > height + fontSize) {
          continue;
        }

        const glyph = glyphs[(index + trailIndex + Math.floor(drop.y / fontSize)) % glyphs.length];
        const alpha = Math.max(0, 0.88 - trailIndex * 0.075);

        if (trailIndex === 0) {
          context.fillStyle = `rgba(232, 244, 255, ${alpha})`;
        } else if (trailIndex < 4) {
          context.fillStyle = `rgba(143, 255, 209, ${alpha})`;
        } else {
          context.fillStyle = `rgba(121, 201, 255, ${alpha * 0.72})`;
        }

        context.fillText(glyph, drop.x, y);
      }

      drop.y += drop.speed * 2.4;

      if (drop.y - drop.length * fontSize > height && Math.random() > 0.96) {
        drop.y = Math.random() * -height * 0.4;
        drop.speed = 0.8 + Math.random() * 1.6;
        drop.length = 8 + Math.floor(Math.random() * 18);
      }
    });

    animationFrame = window.requestAnimationFrame(drawMatrix);
  };

  resizeMatrix();
  drawMatrix();
  window.addEventListener("resize", resizeMatrix);
}

if (!prefersReducedMotion.matches) {
  const trailer = document.createElement("div");
  trailer.className = "mouse-trailer";
  document.body.appendChild(trailer);
  const particleIcons = [
    { classes: "fa-solid fa-microchip is-chip" },
    { classes: "fa-solid fa-circle-nodes is-node" },
    { classes: "fa-solid fa-code is-bracket" }
  ];

  const nodes = Array.from({ length: 12 }, (_, index) => {
    const node = document.createElement("span");
    node.className = "mouse-trailer__node";
    node.style.width = `${18 - index * 0.9}px`;
    node.style.height = `${18 - index * 0.9}px`;
    node.style.marginLeft = `${(18 - index * 0.9) / -2}px`;
    node.style.marginTop = `${(18 - index * 0.9) / -2}px`;
    node.style.filter = `blur(${10 + index * 0.45}px)`;
    node.style.setProperty("--node-opacity", `${Math.max(0.12, 0.52 - index * 0.035)}`);
    trailer.appendChild(node);
    return { element: node, x: window.innerWidth / 2, y: window.innerHeight / 2 };
  });

  const pointer = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    active: false,
    lastMove: 0,
    speed: 0
  };

  let starFlip = false;
  let lastStarAt = 0;

  const spawnStar = (x, y) => {
    const icon = particleIcons[Math.floor(Math.random() * particleIcons.length)];
    const star = document.createElement("i");
    star.className = `mouse-trailer__star ${icon.classes} ${starFlip ? "is-cool" : "is-bright"}`;
    starFlip = !starFlip;
    star.style.left = `${x + (Math.random() * 22 - 11)}px`;
    star.style.top = `${y + (Math.random() * 18 - 14)}px`;
    star.style.setProperty("--fall-x", `${Math.random() * 28 - 14}px`);
    star.style.setProperty("--fall-y", `${36 + Math.random() * 32}px`);
    star.style.setProperty("--spin", `${(Math.random() > 0.5 ? 1 : -1) * (150 + Math.random() * 120)}deg`);
    trailer.appendChild(star);
    star.addEventListener("animationend", () => star.remove(), { once: true });
  };

  const tick = () => {
    const now = performance.now();
    trailer.classList.toggle("is-active", pointer.active && now - pointer.lastMove < 140);

    let followX = pointer.x;
    let followY = pointer.y;

    nodes.forEach((node, index) => {
      const ease = 0.28 - index * 0.014;
      node.x += (followX - node.x) * Math.max(0.1, ease);
      node.y += (followY - node.y) * Math.max(0.1, ease);
      node.element.style.transform = `translate3d(${node.x}px, ${node.y}px, 0) scale(${1 - index * 0.035})`;
      followX = node.x;
      followY = node.y;
    });

    requestAnimationFrame(tick);
  };

  window.addEventListener("mousemove", (event) => {
    const now = performance.now();
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;

    pointer.speed = Math.hypot(dx, dy);
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
    pointer.lastMove = now;

    if (pointer.speed > 8 && now - lastStarAt > Math.max(26, 90 - pointer.speed * 2.2)) {
      spawnStar(pointer.x, pointer.y);
      lastStarAt = now;
    }
  });

  window.addEventListener("mouseleave", () => {
    pointer.active = false;
  });

  requestAnimationFrame(tick);
}

staggerGroups.forEach((group) => {
  Array.from(group.children).forEach((element, index) => {
    if (element.classList.contains("reveal")) {
      element.style.setProperty("--reveal-delay", `${index * 90}ms`);
    }
  });
});

revealElements.forEach((element, index) => {
  if (!element.style.getPropertyValue("--reveal-delay")) {
    element.style.setProperty("--reveal-delay", `${Math.min(index * 35, 220)}ms`);
  }
});

glowGroupSelectors.forEach((selector) => {
  document.querySelectorAll(selector).forEach((group) => {
    const cards = Array.from(group.children);

    if (!cards.length) {
      return;
    }

    group.classList.add("glow-group");
    cards.forEach((card) => card.classList.add("glow-card"));

    const updateSharedGlow = (clientX, clientY) => {
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--glow-x", `${clientX - rect.left}px`);
        card.style.setProperty("--glow-y", `${clientY - rect.top}px`);
      });
    };

    group.addEventListener("mouseleave", () => {
      group.classList.remove("is-active");
      cards.forEach((card) => card.classList.remove("is-hovered"));
    });

    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        group.classList.add("is-active");
        cards.forEach((item) => item.classList.remove("is-hovered"));
        card.classList.add("is-hovered");
      });

      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();

        updateSharedGlow(event.clientX, event.clientY);
        card.style.setProperty("--inner-x", `${event.clientX - rect.left - 1}px`);
        card.style.setProperty("--inner-y", `${event.clientY - rect.top - 1}px`);
      });

      card.addEventListener("mouseleave", () => {
        card.classList.remove("is-hovered");
      });
    });
  });
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}
