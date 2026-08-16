const projects = [
  {
    id: 1,
    title: 'Business Proposals Management',
    desc: 'Managing business proposals involves coordinating and preparing responses to proposals, building the team, and seeing the proposal development process from receipt to acceptance.',
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
    image: 'imagenes/emailMarketing.jpg'
  },
  {
    id: 3,
    title: 'Manage User Accounts',
    desc: 'Managing user accounts involves the governance, control, and lifecycle administration of user identities across enterprise systems.',
    demo: '',
    repo: '',
    stack: ['html','javascript','boostrap','jquery','google suite'],
    image: 'imagenes/usuarios.png'
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
    desc: 'Fixed asset management refers to the process of acquiring, tracking, maintaining, and disposing of a company\'s fixed assets to ensure they are used efficiently.',
    demo: '',
    repo: '',
    stack: ['html','javascript','boostrap','jquery','google suite'],
    image: 'imagenes/asset.jpg'
  }
];

// ==================== LIGHTBOX ====================

class Lightbox {
  constructor() {
    this.lightbox = document.getElementById('lightbox');
    this.image = document.getElementById('lightboxImage');
    this.title = document.getElementById('lightboxTitle');
    this.counter = document.getElementById('imageCounter');
    this.currentIndex = 0;
    this.images = [];
    this.zoomLevel = 1;
    this.rotationAngle = 0;
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.querySelector('.lightbox-close').addEventListener('click', () => this.close());
    document.querySelector('.lightbox-nav.prev').addEventListener('click', () => this.previous());
    document.querySelector('.lightbox-nav.next').addEventListener('click', () => this.next());
    
    document.getElementById('zoomInBtn').addEventListener('click', () => this.zoomIn());
    document.getElementById('zoomOutBtn').addEventListener('click', () => this.zoomOut());
    document.getElementById('fullscreenBtn').addEventListener('click', () => this.toggleFullscreen());
    document.getElementById('rotateBtn').addEventListener('click', () => this.rotate());

    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) this.close();
    });

    this.image.addEventListener('click', () => this.openZoomedView());

    document.addEventListener('keydown', (e) => {
      if (this.lightbox.getAttribute('aria-hidden') === 'false') {
        if (e.key === 'Escape') this.close();
        if (e.key === 'ArrowLeft') this.previous();
        if (e.key === 'ArrowRight') this.next();
      }
    });
  }

  open(imageUrl, title = '', allImages = []) {
    this.images = allImages.length > 0 ? allImages : [imageUrl];
    this.currentIndex = this.images.indexOf(imageUrl);
    if (this.currentIndex === -1) this.currentIndex = 0;
    this.zoomLevel = 1;
    this.rotationAngle = 0;
    this.updateImage();
    this.lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    this.zoomLevel = 1;
    this.rotationAngle = 0;
  }

  updateImage() {
    const img = this.images[this.currentIndex];
    this.image.src = img;
    this.image.style.transform = `scale(${this.zoomLevel}) rotate(${this.rotationAngle}deg)`;
    this.counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
    this.updateNavButtons();
  }

  updateNavButtons() {
    document.querySelector('.lightbox-nav.prev').style.opacity = 
      this.currentIndex === 0 ? '0.3' : '1';
    document.querySelector('.lightbox-nav.next').style.opacity = 
      this.images.length <= 1 ? '0.3' : '1';
  }

  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.zoomLevel = 1;
      this.rotationAngle = 0;
      this.updateImage();
    }
  }

  next() {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
      this.zoomLevel = 1;
      this.rotationAngle = 0;
      this.updateImage();
    }
  }

  zoomIn() {
    this.zoomLevel = Math.min(this.zoomLevel + 0.2, 3);
    this.updateImage();
  }

  zoomOut() {
    this.zoomLevel = Math.max(this.zoomLevel - 0.2, 1);
    this.updateImage();
  }

  rotate() {
    this.rotationAngle = (this.rotationAngle + 90) % 360;
    this.updateImage();
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.lightbox.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen();
    }
  }

  openZoomedView() {
    const zoomModal = document.getElementById('zoomModal');
    document.getElementById('zoomImage').src = this.image.src;
    zoomModal.setAttribute('aria-hidden', 'false');
  }
}

// ==================== IMAGE EDITOR ====================

class ImageEditor {
  constructor() {
    this.modal = document.getElementById('imageEditor');
    this.canvas = document.getElementById('editorCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.currentImage = null;
    this.originalImage = null;
    this.editorState = {
      rotation: 0,
      flipH: false,
      flipV: false,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      grayscale: 0,
      sepia: 0,
      invert: 0
    };
    this.cropMode = false;
    this.cropRatio = null;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Transform buttons
    document.getElementById('rotateLeftBtn').addEventListener('click', () => this.rotateCCW());
    document.getElementById('rotateRightBtn').addEventListener('click', () => this.rotateCW());
    document.getElementById('flipHBtn').addEventListener('click', () => this.flipHorizontal());
    document.getElementById('flipVBtn').addEventListener('click', () => this.flipVertical());
    document.getElementById('resetBtn').addEventListener('click', () => this.resetImage());

    // Filter sliders
    ['brightness', 'contrast', 'saturation'].forEach(filter => {
      const slider = document.getElementById(`${filter}Slider`);
      slider.addEventListener('input', (e) => {
        this.editorState[filter] = e.target.value;
        document.getElementById(`${filter}Value`).textContent = e.target.value;
        this.redraw();
      });
    });

    // Filter presets
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.applyFilterPreset(e.target.dataset.filter));
    });

    // Crop buttons
    document.querySelectorAll('.crop-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.selectCropRatio(e.target.dataset.ratio));
    });

    // Editor actions
    document.querySelector('.editor-close').addEventListener('click', () => this.close());
    document.getElementById('cancelEditorBtn').addEventListener('click', () => this.close());
    document.getElementById('downloadBtn').addEventListener('click', () => this.downloadImage());

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
  }

  open(imageUrl) {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      this.originalImage = img;
      this.currentImage = img;
      this.setupCanvas();
      this.redraw();
      this.modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    img.onerror = () => alert('Error loading image');
    img.src = imageUrl;
  }

  setupCanvas() {
    const maxWidth = 600;
    const maxHeight = 400;
    let width = this.currentImage.width;
    let height = this.currentImage.height;

    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width *= ratio;
      height *= ratio;
    }

    this.canvas.width = width;
    this.canvas.height = height;
  }

  redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();

    // Position transformations
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    if (this.editorState.rotation) this.ctx.rotate((this.editorState.rotation * Math.PI) / 180);
    if (this.editorState.flipH) this.ctx.scale(-1, 1);
    if (this.editorState.flipV) this.ctx.scale(1, -1);

    // Apply image filters
    this.applyFilters();

    this.ctx.drawImage(
      this.currentImage,
      -this.canvas.width / 2,
      -this.canvas.height / 2,
      this.canvas.width,
      this.canvas.height
    );

    this.ctx.restore();
  }

  applyFilters() {
    const filters = [];

    if (this.editorState.brightness !== 100) {
      filters.push(`brightness(${this.editorState.brightness}%)`);
    }
    if (this.editorState.contrast !== 100) {
      filters.push(`contrast(${this.editorState.contrast}%)`);
    }
    if (this.editorState.saturation !== 100) {
      filters.push(`saturate(${this.editorState.saturation}%)`);
    }
    if (this.editorState.grayscale > 0) {
      filters.push(`grayscale(${this.editorState.grayscale}%)`);
    }
    if (this.editorState.sepia > 0) {
      filters.push(`sepia(${this.editorState.sepia}%)`);
    }
    if (this.editorState.invert > 0) {
      filters.push(`invert(${this.editorState.invert}%)`);
    }
    if (this.editorState.blur > 0) {
      filters.push(`blur(${this.editorState.blur}px)`);
    }

    if (filters.length > 0) {
      this.ctx.filter = filters.join(' ');
    }
  }

  rotateCW() {
    this.editorState.rotation = (this.editorState.rotation + 90) % 360;
    this.redraw();
  }

  rotateCCW() {
    this.editorState.rotation = (this.editorState.rotation - 90 + 360) % 360;
    this.redraw();
  }

  flipHorizontal() {
    this.editorState.flipH = !this.editorState.flipH;
    this.redraw();
  }

  flipVertical() {
    this.editorState.flipV = !this.editorState.flipV;
    this.redraw();
  }

  applyFilterPreset(preset) {
    this.resetFilters();
    switch (preset) {
      case 'grayscale':
        this.editorState.grayscale = 100;
        break;
      case 'sepia':
        this.editorState.sepia = 100;
        break;
      case 'invert':
        this.editorState.invert = 100;
        break;
      case 'blur':
        this.editorState.blur = 5;
        break;
    }
    this.redraw();
  }

  resetFilters() {
    this.editorState.brightness = 100;
    this.editorState.contrast = 100;
    this.editorState.saturation = 100;
    this.editorState.grayscale = 0;
    this.editorState.sepia = 0;
    this.editorState.invert = 0;
    this.editorState.blur = 0;

    document.getElementById('brightnessSlider').value = 100;
    document.getElementById('contrastSlider').value = 100;
    document.getElementById('saturationSlider').value = 100;
    document.getElementById('brightnessValue').textContent = '100';
    document.getElementById('contrastValue').textContent = '100';
    document.getElementById('saturationValue').textContent = '100';
  }

  selectCropRatio(ratio) {
    this.cropRatio = ratio === 'free' ? null : ratio;
    document.querySelectorAll('.crop-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');
  }

  resetImage() {
    this.editorState = {
      rotation: 0,
      flipH: false,
      flipV: false,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      grayscale: 0,
      sepia: 0,
      invert: 0
    };
    this.resetFilters();
    this.redraw();
  }

  downloadImage() {
    const link = document.createElement('a');
    link.href = this.canvas.toDataURL('image/png');
    link.download = `edited-image-${Date.now()}.png`;
    link.click();
  }

  close() {
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    this.resetImage();
  }
}

// ==================== IMAGE UPLOAD MANAGER ====================

class ImageUploadManager {
  constructor() {
    this.modal = document.getElementById('uploadManager');
    this.uploadZone = document.getElementById('uploadZone');
    this.fileInput = document.getElementById('fileInput');
    this.preview = document.getElementById('uploadPreview');
    this.uploadedFiles = [];
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.uploadZone.addEventListener('dragover', (e) => this.handleDragOver(e));
    this.uploadZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
    this.uploadZone.addEventListener('drop', (e) => this.handleDrop(e));

    document.getElementById('fileInputBtn').addEventListener('click', () => this.fileInput.click());
    this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

    document.querySelector('.upload-close').addEventListener('click', () => this.close());
    document.getElementById('closeUploadBtn').addEventListener('click', () => this.close());
    document.getElementById('insertImagesBtn').addEventListener('click', () => this.insertImages());

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
  }

  handleDragOver(e) {
    e.preventDefault();
    this.uploadZone.classList.add('drag-active');
  }

  handleDragLeave(e) {
    e.preventDefault();
    this.uploadZone.classList.remove('drag-active');
  }

  handleDrop(e) {
    e.preventDefault();
    this.uploadZone.classList.remove('drag-active');
    const files = Array.from(e.dataTransfer.files);
    this.processFiles(files);
  }

  handleFileSelect(e) {
    const files = Array.from(e.target.files);
    this.processFiles(files);
  }

  processFiles(files) {
    files.forEach(file => {
      if (this.validateFile(file)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.uploadedFiles.push({
            name: file.name,
            size: file.size,
            dataUrl: e.target.result
          });
          this.updatePreview();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  validateFile(file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      alert(`Invalid format: ${file.name}. Use JPG, PNG, or WebP.`);
      return false;
    }
    if (file.size > maxSize) {
      alert(`File too large: ${file.name}. Max 10MB.`);
      return false;
    }
    return true;
  }

  updatePreview() {
    this.preview.innerHTML = '';
    this.uploadedFiles.forEach((file, index) => {
      const item = document.createElement('div');
      item.className = 'preview-item';
      item.innerHTML = `
        <div class="preview-image-wrapper">
          <img src="${file.dataUrl}" alt="Preview" class="preview-image" />
        </div>
        <div class="preview-info">
          <p>${file.name}</p>
          <small>${(file.size / 1024).toFixed(2)} KB</small>
        </div>
        <button class="preview-remove" data-index="${index}" aria-label="Remove image">✕</button>
      `;
      this.preview.appendChild(item);
    });

    document.querySelectorAll('.preview-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = Number(e.target.dataset.index);
        this.uploadedFiles.splice(index, 1);
        this.updatePreview();
      });
    });

    document.getElementById('insertImagesBtn').style.display = 
      this.uploadedFiles.length > 0 ? 'block' : 'none';
  }

  insertImages() {
    // This can be extended to insert images into projects
    console.log('Inserting images:', this.uploadedFiles);
    alert(`${this.uploadedFiles.length} image(s) ready to use!`);
    this.close();
  }

  open() {
    this.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

// ==================== ORIGINAL FUNCTIONS ====================

function mountProjects() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  projects.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    const repoLink = p.repo ? `<a class="btn secondary" href="${p.repo}" target="_blank">Repository</a>` : '';
    const demoLink = p.demo ? `<a class="btn" href="${p.demo}" target="_blank">Demo</a>` : '';
    card.innerHTML = `
      <h4>${p.title}</h4>
      <p>${p.desc}</p>
      <div class="actions">
        <button class="btn" data-id="${p.id}">Details</button>
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

function openModal(project) {
  const modal = document.getElementById('modal');
  document.getElementById('modalTitle').textContent = project.title;
  document.getElementById('modalDesc').textContent = project.desc;
  const stackEl = document.getElementById('modalStack');
  stackEl.innerHTML = '';
  project.stack.forEach(s => {
    const li = document.createElement('li');
    li.textContent = s;
    stackEl.appendChild(li);
  });
  
  const img = document.getElementById('modalImage');
  const editBtn = document.getElementById('editImageBtn');
  
  if (project.image) {
    img.src = project.image;
    img.style.display = '';
    img.alt = project.title;
    editBtn.style.display = 'block';
    
    // Open lightbox
    img.addEventListener('click', () => {
      lightbox.open(project.image, project.title, 
        projects.filter(p => p.image).map(p => p.image));
    }, { once: true });
    
    editBtn.onclick = () => {
      imageEditor.open(project.image);
    };
  } else {
    img.style.display = 'none';
    editBtn.style.display = 'none';
  }
  
  const link = document.getElementById('modalLink');
  link.href = project.demo || project.repo || '#';
  link.textContent = project.demo ? 'See demo' : (project.repo ? 'See Repository' : 'No link');
  
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// ==================== INITIALIZATION ====================

let lightbox;
let imageEditor;
let uploadManager;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  
  // Initialize instances
  lightbox = new Lightbox();
  imageEditor = new ImageEditor();
  uploadManager = new ImageUploadManager();
  
  // Mount projects
  mountProjects();

  // Modal events
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });

  // Zoom modal close
  document.querySelector('.zoom-modal-close').addEventListener('click', () => {
    document.getElementById('zoomModal').setAttribute('aria-hidden', 'true');
  });

  document.getElementById('zoomModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      document.getElementById('zoomModal').setAttribute('aria-hidden', 'true');
    }
  });

  // Contact form
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    alert(`Thanks, ${data.get('nombre')} — message received.`);
    form.reset();
  });
});
