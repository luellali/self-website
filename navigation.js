const designTab = document.querySelector('#tab-design');
designTab.addEventListener('click', () => location.assign('./design-work.html'));
const courseTab = document.querySelector('#tab-course');
courseTab.addEventListener('click', () => location.assign('./course-projects.html'));
const theme = new URLSearchParams(location.search).get('theme');
if (['course', 'explorations', 'about'].includes(theme)) {
  document.querySelector(`[data-theme="${theme}"].tab`).click();
}
