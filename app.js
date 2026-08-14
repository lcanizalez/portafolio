const projects = [
  {
    id: 1,
    title: 'Business Proposals Management',
    desc: 'Managing business proposals involves coordinating and preparing responses to proposals, building the team, and overseeing the proposal development process from receipt to acceptance.',
    demo: '',
    repo: '',
    stack: ['html','javascript','boostrap','jquery','appscript','google suite'],
    image: 'imagenes/proposals.jpg',
    imageClass: 'imagen-propuesta'
  },

  {
    id: 2,
    title: 'Email Campaign Management',
    desc: 'Email campaign management is the process of planning, creating, executing, and analyzing targeted email communications to engage an audience, promote products or services, and achieve specific marketing goals.',
    demo: '',
    repo: '',
    stack: ['html','javascript','boostrap','jquery','google suite'],
    image: '/imagenes/emailMarketing.jpg'
  },
  {
    id: 3,
    title: 'Manage User Accounts',
    desc: 'Managing user accounts involves the governance, control, and lifecycle administration of user identities across enterprise systems.',
    demo: '',
    repo: '',
    stack: ['html','javascript','boostrap','jquery','google suite'],
    image: '/imagenes/usuarios.png'
  },
  {
    id: 4,
    title: 'Sales Funnel Diagram',
    desc: 'The funnel illustrates the journey of a potential sales proposition, from its creation to its acceptance, and helps companies optimize their sales cycle by identifying which stages can be improved to streamline the process.',
    demo: '',
    repo: '',
    stack: ['html','javascript','boostrap','jquery','google suite'],
    image: 'imagenes/funnel.jpg'
  },
  {
    id: 5,
    title: 'Fixed Asset Management',
    desc: 'Fixed asset management refers to the process of acquiring, tracking, maintaining, and disposing of a company’s fixed assets to ensure they are used efficiently.',
    demo: '',
    repo: '',
    stack: ['html','javascript','boostrap','jquery','google suite'],
    image: 'imagenes/asset.jpg'
  }
];

function mountProjects() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  projects.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    const repoLink = p.repo ? `<a class="btn secondary" href="${p.repo}" target="_blank">Repositorio</a>` : '';
    const demoLink = p.demo ? `<a class="btn" href="${p.demo}" target="_blank">Demo</a>` : '';
    card.innerHTML = `
      <h4>${p.title}</h4>
      <p>${p.desc}</p>
      <div class="actions">
        <button class="btn" data-id="${p.id}">Detalles</button>
        ${demoLink}
        ${repoLink}
      </div>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll('button[data-id]').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = Number(e.currentTarget.dataset.id);
      openModal(projects.find(p => p.id === id));
    });
  });
}

function openModal(project){
  const modal = document.getElementById('modal');
  document.getElementById('modalTitle').textContent = project.title;
  document.getElementById('modalDesc').textContent = project.desc;
  const stackEl = document.getElementById('modalStack');
  stackEl.innerHTML = '';
  project.stack.forEach(s => {
    const li = document.createElement('li'); li.textContent = s; stackEl.appendChild(li);
  });
  const img = document.getElementById('modalImage');
  if(project.image){ img.src = project.image; img.style.display = ''; img.alt = project.title; } else { img.style.display = 'none'; }
  const link = document.getElementById('modalLink');
  link.href = project.demo || project.repo || '#';
  link.textContent = project.demo ? 'Ver demo' : (project.repo ? 'Ver repositorio' : 'Sin enlace');
  modal.setAttribute('aria-hidden','false');
}

function closeModal(){
  const modal = document.getElementById('modal');
  modal.setAttribute('aria-hidden','true');
}

document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('year').textContent = new Date().getFullYear();
  mountProjects();

  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modal').addEventListener('click', (e)=>{
    if(e.target === e.currentTarget) closeModal();
  });

  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = new FormData(form);
    alert(`Gracias, ${data.get('nombre')} — mensaje recibido.`);
    form.reset();
  });
});

