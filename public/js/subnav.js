const toggleBtn = document.getElementById("toggle-folder-input");
const dropdown = document.getElementById("folder-name-dropdown");
const form = document.getElementById("new-folder-form");

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-folder-input");
  const dropdown = document.getElementById("new-folder-form");

  toggleBtn.addEventListener("click", () => {
    dropdown.classList.toggle("hidden");

    const input = dropdown.querySelector("input[name='name']");
    if (!dropdown.classList.contains("hidden")) {
      input.focus();
    }
  });
});

toggleBtn.addEventListener("click", () => {
  if (dropdown.classList.contains("hidden")) {
    dropdown.classList.remove("hidden");
    dropdown.querySelector("input[name='name']").focus();
  } else {
    const nameInput = dropdown.querySelector("input[name='name']");
    if (nameInput.value.trim() !== "") {
      form.submit();
    } else {
      nameInput.focus();
    }
  }
});

dropdown
  .querySelector("input[name='name']")
  .addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.target.value.trim() !== "") {
        form.submit();
      }
    }
  });
