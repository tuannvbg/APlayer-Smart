function switchDataset(type) {
  let file = '';
  if (type === 'central') file = 'data/uyvientrunguong.json';
  else if (type === 'provincial') file = 'data/uyvientrunguong.json';
  else if (type === 'merged') file = 'data/lanhdao34tinhthanhmoi.json';

  fetch(file).then(res => res.json()).then(data => {
    if (type === 'provincial') {
      data = data.filter(d => d.is_provincial_secretary);
    }
    renderLeaders(data);
  });
}

function renderLeaders(data) {
  const container = document.getElementById('leader-list');
  container.innerHTML = '';
  data.forEach(ld => {
    const card = document.createElement('div');
    card.className = 'leader-card';
    card.innerHTML = `
      <img src="${ld.image || 'assets/images/default.jpg'}" alt="${ld.name}" />
      <h3>${ld.name}</h3>
      <p><strong>Chức vụ:</strong> ${ld.position}</p>
      <p><strong>Quê quán:</strong> ${ld.origin}</p>
      <details><summary>📈 Quá trình công tác</summary><ul>${ld.career.map(c => `<li>${c}</li>`).join('')}</ul></details>
      <p>${ld.bio}</p>
    `;
    container.appendChild(card);
  });
}