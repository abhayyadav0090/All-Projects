const navLinks = document.querySelectorAll("nav ul li a");
const projects = document.querySelectorAll(".project");

// Default: show first project
projects[0].classList.add("active");
navLinks[0].classList.add("active");

navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const targetId = link.getAttribute("data-project");

    // Hide all projects
    projects.forEach(p => p.classList.remove("active"));
    navLinks.forEach(l => l.classList.remove("active"));

    // Show selected project
    document.getElementById(targetId).classList.add("active");
    link.classList.add("active");
  });
});
