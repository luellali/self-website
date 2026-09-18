const shell = document.querySelector('[data-video-shell]');
const film = document.querySelector('#concept-film');
const playButton = shell?.querySelector('.video-shell__play');

function playFilm() {
  if (!film || !shell) return;
  shell.classList.add('is-playing');
  film.controls = true;
  film.play().catch(() => shell.classList.remove('is-playing'));
}

playButton?.addEventListener('click', playFilm);
film?.addEventListener('play', () => shell?.classList.add('is-playing'));
film?.addEventListener('pause', () => shell?.classList.remove('is-playing'));
film?.addEventListener('ended', () => shell?.classList.remove('is-playing'));

document.querySelector('[data-video-launch]')?.addEventListener('click', () => {
  shell?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  playFilm();
});
