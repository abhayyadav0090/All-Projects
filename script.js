(() => {
  const DESKTOP_WIDTH = 1280;

  // 1. Single Shared ResizeObserver (Avoids synchronous clientWidth layout thrashing)
  const iframeScreens = document.querySelectorAll(".screen");
  const scaleObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const width = entry.contentRect.width;
      if (width > 0) {
        const scale = (width / DESKTOP_WIDTH).toFixed(4);
        entry.target.style.setProperty("--scale", scale);
      }
    }
  });

  iframeScreens.forEach((screen) => {
    const frame = screen.querySelector("iframe");
    if (!frame) return;

    scaleObserver.observe(screen);

    // Clear loading shimmer when iframe finishes loading
    frame.addEventListener("load", () => {
      screen.classList.remove("is-loading");
    });
  });

  // 2. Interactive Sandbox Toggle & Copy URL Controls
  const toast = document.getElementById("toast");
  let toastTimer = null;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 2200);
  };

  document.addEventListener("click", async (e) => {
    // Handle Interactive Iframe Toggle
    const interactBtn = e.target.closest(".interact-toggle");
    if (interactBtn) {
      const preview = interactBtn.closest(".preview");
      const screen = preview?.querySelector(".screen");
      if (!screen) return;

      const isInteractive = screen.getAttribute("data-interactive") === "true";
      const nextState = !isInteractive;
      screen.setAttribute("data-interactive", String(nextState));
      interactBtn.setAttribute("aria-pressed", String(nextState));
      interactBtn.textContent = nextState ? "Lock" : "Interact";
      showToast(nextState ? "Interactive sandbox unlocked" : "Sandbox locked for scrolling");
      return;
    }

    // Handle Copy Live URL Button
    const copyBtn = e.target.closest(".copy-url");
    if (copyBtn) {
      const url = copyBtn.getAttribute("data-url");
      if (!url) return;
      try {
        await navigator.clipboard.writeText(url);
        showToast(`Copied: ${url}`);
      } catch {
        showToast("Unable to copy URL");
      }
      return;
    }

    // Handle Clickable Stack Tag Filtering
    const stackTag = e.target.closest(".stack-tag");
    if (stackTag) {
      const tech = stackTag.getAttribute("data-tech") || "";
      if (searchInput) {
        searchInput.value = tech;
        applyFilters();
        showToast(`Filtered by stack: ${tech}`);
      }
    }
  });

  // 3. Category Filtering & Instant Search
  const filterBtns = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("project-search");
  const clearBtn = document.getElementById("clear-filter");
  const emptyState = document.getElementById("empty-state");
  const emptyReset = document.getElementById("empty-reset");
  const visibleCountEl = document.getElementById("visible-count");
  const projects = [...document.querySelectorAll(".project")];
  const navLinks = [...document.querySelectorAll(".index a")];

  let activeCategory = "all";

  const applyFilters = () => {
    const query = (searchInput?.value || "").trim().toLowerCase();
    let visibleCount = 0;

    projects.forEach((project) => {
      const categories = (project.getAttribute("data-category") || "").split(" ");
      const tags = (project.getAttribute("data-tags") || "").toLowerCase();
      const title = (project.querySelector("h2")?.textContent || "").toLowerCase();
      const desc = (project.querySelector(".info p")?.textContent || "").toLowerCase();

      const matchesCategory = activeCategory === "all" || categories.includes(activeCategory);
      const matchesQuery = !query || tags.includes(query) || title.includes(query) || desc.includes(query);
      const isVisible = matchesCategory && matchesQuery;

      project.hidden = !isVisible;
      if (isVisible) visibleCount++;

      // Dim hidden items in the sidebar directory
      const matchingLink = navLinks.find((l) => l.getAttribute("data-target") === project.id);
      if (matchingLink) {
        matchingLink.parentElement.hidden = !isVisible;
      }
    });

    if (visibleCountEl) visibleCountEl.textContent = String(visibleCount);
    if (emptyState) emptyState.hidden = visibleCount > 0;
    if (clearBtn) clearBtn.hidden = activeCategory === "all" && !query;
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      activeCategory = btn.getAttribute("data-filter") || "all";
      applyFilters();
    });
  });

  searchInput?.addEventListener("input", applyFilters);

  const resetAllFilters = () => {
    activeCategory = "all";
    if (searchInput) searchInput.value = "";
    filterBtns.forEach((b) => {
      const isAll = b.getAttribute("data-filter") === "all";
      b.classList.toggle("active", isAll);
      b.setAttribute("aria-selected", String(isAll));
    });
    applyFilters();
  };

  clearBtn?.addEventListener("click", resetAllFilters);
  emptyReset?.addEventListener("click", resetAllFilters);

  // 4. Multi-Column & Bottom-Aware Scroll-Spy
  const setActiveNav = (id) => {
    navLinks.forEach((link) => {
      const isMatch = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("current", isMatch);
      if (isMatch) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };

  const updateActiveOnScroll = () => {
    const visibleProjects = projects.filter((p) => !p.hidden);
    if (visibleProjects.length === 0) return;

    // If scrolled to the very bottom of the page, highlight the last visible project
    const scrolledToBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40;
    if (scrolledToBottom) {
      setActiveNav(visibleProjects[visibleProjects.length - 1].id);
      return;
    }

    const triggerLine = window.innerHeight * 0.32;
    let bestCandidate = visibleProjects[0];
    let smallestDistance = Infinity;

    for (const project of visibleProjects) {
      const rect = project.getBoundingClientRect();
      if (rect.bottom > 80 && rect.top <= triggerLine + 120) {
        const distance = Math.abs(rect.top - triggerLine);
        if (distance < smallestDistance) {
          smallestDistance = distance;
          bestCandidate = project;
        }
      }
    }

    setActiveNav(bestCandidate.id);
  };

  let scrollTicking = false;
  window.addEventListener("scroll", () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        updateActiveOnScroll();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // Also highlight immediately when clicking or hovering a card
  projects.forEach((project) => {
    project.addEventListener("mouseenter", () => setActiveNav(project.id));
  });

  updateActiveOnScroll();

  // 5. Persistent Light / Dark Theme Engine & Keyboard Shortcuts
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const storedTheme = localStorage.getItem("ay_portfolio_theme");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const setTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("ay_portfolio_theme", theme);
    const icon = themeToggle?.querySelector(".theme-icon");
    if (icon) icon.textContent = theme === "dark" ? "☾" : "☀";
  };

  setTheme(storedTheme || (systemDark ? "dark" : "light"));

  themeToggle?.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(current);
  });

  // Keyboard shortcuts: '/' focuses search, 't' toggles theme
  document.addEventListener("keydown", (e) => {
    const tag = document.activeElement?.tagName;
    const isTyping = tag === "INPUT" || tag === "TEXTAREA";

    if (e.key === "/" && !isTyping) {
      e.preventDefault();
      searchInput?.focus();
    } else if ((e.key === "t" || e.key === "T") && !isTyping) {
      const current = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      setTheme(current);
      showToast(`Switched to ${current} theme`);
    } else if (e.key === "Escape" && isTyping) {
      searchInput?.blur();
    }
  });
})();
