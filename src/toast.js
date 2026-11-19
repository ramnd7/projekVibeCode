// Toast singkat dengan aria-live. Sumber: UI-SPEC.md §6.5, C-03.

let area = null;

export function pasangAreaToast() {
  if (area && document.body.contains(area)) return area;
  area = document.createElement('div');
  area.className = 'toast-area';
  area.setAttribute('aria-live', 'polite');
  area.setAttribute('aria-atomic', 'true');
  document.body.append(area);
  return area;
}

export function toast(pesan) {
  const wadah = pasangAreaToast();
  const item = document.createElement('div');
  item.className = 'toast';
  const teks = document.createElement('span');
  teks.textContent = pesan;
  const tutup = document.createElement('button');
  tutup.type = 'button';
  tutup.className = 'toast-tutup';
  tutup.textContent = '×';
  tutup.setAttribute('aria-label', 'Tutup pesan');
  tutup.addEventListener('click', () => item.remove());
  item.append(teks, tutup);
  wadah.append(item);
  window.setTimeout(() => item.remove(), 5000);
}
