// Dialog konfirmasi memakai <dialog> native (Esc + jebakan fokus bawaan).
// Sumber: UI-SPEC.md §6.5, TASKS.md T4.4.

import { el, tombol } from './dom.js';

export function konfirmasi({ judul, pesan, teksAksi = 'Konfirmasi', bahaya = false, aksiTidakAktif = false, alasan = '' }) {
  return new Promise((resolve) => {
    const pemicu = document.activeElement;
    const dialog = el('dialog', { kelas: 'dialog', atribut: { 'aria-labelledby': 'dialog-judul' } });
    const h = el('h2', { teks: judul, atribut: { id: 'dialog-judul' } });
    const p = el('p', { teks: pesan });
    const aksi = tombol(teksAksi, {
      kelas: bahaya ? 'btn btn-bahaya' : 'btn btn-utama',
      klik: () => { dialog.returnValue = 'ya'; dialog.close(); },
      nonaktif: aksiTidakAktif,
    });
    const batal = tombol('Batal', { kelas: 'btn btn-sekunder', klik: () => { dialog.returnValue = ''; dialog.close(); } });
    const aksiWrap = el('div', { kelas: 'dialog-aksi' });
    aksiWrap.append(batal, aksi);
    dialog.append(h, p);
    if (alasan) dialog.append(el('p', { kelas: 'error', teks: `! ${alasan}` }));
    dialog.append(aksiWrap);
    dialog.addEventListener('close', () => {
      dialog.remove();
      if (pemicu && typeof pemicu.focus === 'function') pemicu.focus();
      resolve(dialog.returnValue === 'ya');
    });
    document.body.append(dialog);
    dialog.showModal();
  });
}

export function tutupDialogSetelah(dialog) {
  dialog.close();
}
