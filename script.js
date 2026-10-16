(() => {
  const DESKTOP_WIDTH = 1280;
  const LOAD_TIMEOUT_MS = 12000;

  // ---------- Shared elements ----------
  const toast = document.getElementById("toast");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("project-search");
  const clearBtn = document.getElementById("clear-filter");
  const emptyState = document.getElementById("empty-state");
  const emptyReset = document.getElementById("empty-reset");
  const visibleCountEl = document.getElementById("visible-count");
  const projects = [...document.querySelectorAll(".project")];
  const navLinks = [...document.querySelectorAll(".index a")];
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");

  let activeCategory = "all";
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

  // Safe storage (can throw in private mode or when blocked)
  const storage = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch {
        /* ignore */
      }
    },
  };

  // ---------- 1. Iframe scaling + loading state ----------
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

    const stopLoading = () => screen.classList.remove("is-loading");
    frame.addEventListener("load", stopLoading);
    // Never leave the shimmer on forever (slow Render cold start, blocked frame)
    setTimeout(stopLoading, LOAD_TIMEOUT_MS);
  });

  // ---------- 2. Interactive toggle, copy URL, stack tags ----------
  const setInteractive = (screen, button, on) => {
    screen.setAttribute("data-interactive", String(on));
    if (button) {
      button.setAttribute("aria-pressed", String(on));
      button.textContent = on ? "Lock" : "Interact";
    }
  };

  const lockAllFrames = () => {
    document.querySelectorAll(".screen[data-interactive='true']").forEach((screen) => {
      const btn = screen.closest(".preview")?.querySelector(".interact-toggle");
      setInteractive(screen, btn, false);
    });
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback for browsers or contexts that block the clipboard API
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
      } catch {
        return false;
      }
    }
  };

  document.addEventListener("click", async (e) => {
    // Interactive iframe toggle
    const interactBtn = e.target.closest(".interact-toggle");
    if (interactBtn) {
      const screen = interactBtn.closest(".preview")?.querySelector(".screen");
      if (!screen) return;

      const turnOn = screen.getAttribute("data-interactive") !== "true";
      if (turnOn) lockAllFrames(); // only one frame unlocked at a time
      setInteractive(screen, interactBtn, turnOn);
      showToast(turnOn ? "Interactive sandbox unlocked" : "Sandbox locked for scrolling");
      return;
    }

    // Copy live URL
    const copyBtn = e.target.closest(".copy-url");
    if (copyBtn) {
      const url = copyBtn.getAttribute("data-url");
      if (!url) return;
      const ok = await copyText(url);
      showToast(ok ? `Copied: ${url}` : "Unable to copy URL");
      return;
    }

    // Stack tag filtering
    const stackTag = e.target.closest(".stack-tag");
    if (stackTag && searchInput) {
      const tech = stackTag.getAttribute("data-tech") || "";
      searchInput.value = tech;
      applyFilters();
      showToast(`Filtered by stack: ${tech}`);
    }
  });

  // ---------- 3. Category filter + search ----------
  function applyFilters() {
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

      const matchingLink = navLinks.find((l) => l.getAttribute("data-target") === project.id);
      if (matchingLink) matchingLink.parentElement.hidden = !isVisible;
    });

    if (visibleCountEl) visibleCountEl.textContent = String(visibleCount);
    if (emptyState) emptyState.hidden = visibleCount > 0;
    if (clearBtn) clearBtn.hidden = activeCategory === "all" && !query;
  }

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

  // ---------- 4. Scroll-spy ----------
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

    const scrolledToBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40;
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
  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          updateActiveOnScroll();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    },
    { passive: true }
  );

  projects.forEach((project) => {
    project.addEventListener("mouseenter", () => setActiveNav(project.id));
  });

  updateActiveOnScroll();

  // ---------- 5. Theme + keyboard shortcuts ----------
  const setTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    storage.set("ay_portfolio_theme", theme);
    const icon = themeToggle?.querySelector(".theme-icon");
    if (icon) icon.textContent = theme === "dark" ? "\u263E" : "\u2600";
  };

  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(storage.get("ay_portfolio_theme") || (systemDark ? "dark" : "light"));

  const toggleTheme = () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(next);
    return next;
  };

  themeToggle?.addEventListener("click", toggleTheme);

  document.addEventListener("keydown", (e) => {
    const tag = document.activeElement?.tagName;
    const isTyping = tag === "INPUT" || tag === "TEXTAREA";

    if (e.key === "/" && !isTyping) {
      e.preventDefault();
      searchInput?.focus();
    } else if ((e.key === "t" || e.key === "T") && !isTyping) {
      showToast(`Switched to ${toggleTheme()} theme`);
    } else if (e.key === "Escape") {
      if (isTyping) searchInput?.blur();
      lockAllFrames();
    }
  });
})();
