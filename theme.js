// Independent of WebGL: themes still work while the model loads or falls back.
const page = document.querySelector('.page');
const tabs = [...document.querySelectorAll('.tab')];
const panel = document.querySelector('.hero');
function select(tab) {
  page.dataset.theme = tab.dataset.theme;
  panel.setAttribute('aria-labelledby', tab.id);
  for (const item of tabs) {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
    item.querySelector('.symbol').textContent = active ? '↗' : '+';
  }
}
for (const tab of tabs) {
  tab.addEventListener('pointerenter', () => select(tab));
  tab.addEventListener('focus', () => select(tab));
  tab.addEventListener('click', () => select(tab));
  tab.addEventListener('keydown', event => {
    const index = tabs.indexOf(tab);
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); tabs[next].focus(); }
  });
}
// Keep the last preview when leaving a tab, avoiding flashes between tabs.
