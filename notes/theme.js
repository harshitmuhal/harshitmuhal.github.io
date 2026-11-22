(() => {
  let theme = "light";
  try {
    const saved = localStorage.getItem("hm-notes-theme");
    if (saved === "light" || saved === "dark") theme = saved;
  } catch (error) {
    console.warn(
      "Theme preference could not be read from browser storage.",
      error
    );
  }
  document.documentElement.dataset.theme = theme;
})();
