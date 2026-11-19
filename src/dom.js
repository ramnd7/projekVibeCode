// Helper pembuat elemen. Semua teks dinamis memakai textContent.

export function el(tag, opsi = {}, ...anak) {
  const node = document.createElement(tag);
  if (opsi.kelas) node.className = opsi.kelas;
  if (opsi.teks !== undefined && opsi.teks !== null) node.textContent = String(opsi.teks);
  if (opsi.atribut) for (const [kunci, nilai] of Object.entries(opsi.atribut)) node.setAttribute(kunci, String(nilai));
  for (const item of anak) if (item !== null && item !== undefined) node.append(item);
  return node;
}

export function tombol(teks, { kelas = 'btn', klik, atribut = {}, nonaktif = false } = {}) {
  const node = el('button', { teks, kelas, atribut: { type: 'button', ...atribut } });
  node.disabled = nonaktif;
  if (klik) node.addEventListener('click', klik);
  return node;
}

export function bidang(label, input, { wajib = false, error = '', id } = {}) {
  const wrap = el('div', { kelas: 'bidang' });
  if (id) input.id = id;
  const labelEl = el('label', { atribut: { for: id }, teks: wajib ? `${label} *` : label });
  wrap.append(labelEl, input);
  if (error) {
    const pesan = el('p', { kelas: 'error', teks: `! ${error}`, atribut: { id: `${id}-error` } });
    input.setAttribute('aria-describedby', `${id}-error`);
    input.setAttribute('aria-invalid', 'true');
    wrap.append(pesan);
  }
  return wrap;
}
