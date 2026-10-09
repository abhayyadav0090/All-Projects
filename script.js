// 1) Live previews are drawn at 1280px wide (a normal desktop size)
//    and shrunk to fit whatever width their card has.
const DESKTOP_WIDTH = 1280;

document.querySelectorAll(".screen").forEach(screen => {
  const frame = screen.querySelector("iframe");
  if (!frame) return; // screenshot previews need no scaling

  const fit = () => {
    frame.style.transform = `scale(${screen.clientWidth / DESKTOP_WIDTH})`;
  };

  fit();
  new ResizeObserver(fit).observe(screen);
});

// 2) Highlight the project that is on screen in the jump list.
//    Two projects can sit side by side, so we pick the first one in page order.
const links = document.querySelectorAll(".index a");
const projects = [...document.querySelectorAll(".project")];
const visible = new Set();

const watcher = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) visible.add(entry.target);
    else visible.delete(entry.target);
  });

  const first = projects.find(project => visible.has(project));
  if (!first) return;

  links.forEach(link => {
    link.classList.toggle("current", link.getAttribute("href") === "#" + first.id);
  });
}, { rootMargin: "-30% 0px -60% 0px" });

projects.forEach(project => watcher.observe(project));
