document.addEventListener('DOMContentLoaded', function () {
    const dropdownContents = document.querySelectorAll('.options-dropdown-content');
    dropdownContents.forEach(function (dropdownContent) {
      dropdownContent.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    });
  });