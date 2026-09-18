(() => {
  const liveDialog = document.querySelector('.matchus-live-dialog');
  const liveFrame = liveDialog?.querySelector('iframe');
  if (!liveDialog || !liveFrame) return;

  let liveOpener;
  const openLiveDemo = button => {
    liveOpener = button;
    if (!liveFrame.getAttribute('src')) liveFrame.setAttribute('src', liveFrame.dataset.src);
    if (typeof liveDialog.showModal === 'function') liveDialog.showModal();
    else liveDialog.setAttribute('open', '');
  };

  document.querySelectorAll('.demo-launch').forEach(button => {
    button.addEventListener('click', () => openLiveDemo(button));
  });

  liveDialog.querySelector('.close-live-demo').addEventListener('click', () => liveDialog.close());
  liveDialog.addEventListener('click', event => {
    if (event.target === liveDialog) liveDialog.close();
  });
  liveDialog.addEventListener('close', () => liveOpener?.focus());
})();
