document.addEventListener('DOMContentLoaded', () => {
  const navBtns = document.querySelectorAll('.nav-btn');
  const tabs = document.querySelectorAll('.tab-content');

  // Handle Tab Switching
  navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
          navBtns.forEach(b => b.classList.remove('active'));
          tabs.forEach(t => t.classList.remove('active'));
          
          btn.classList.add('active');
          const targetId = btn.getAttribute('data-target');
          document.getElementById(targetId).classList.add('active');
      });
  });

  // LocalStorage Persistence - V4
  const sandbox = document.getElementById('editable-sandbox');
  const overlayHeader = document.querySelector('.logo-text');
  const storageKeyBox = 'grupoKeikoApp_Sandbox_v4';
  const storageKeyHead = 'grupoKeikoApp_Header_v4';

  const savedState = localStorage.getItem(storageKeyBox);
  if (savedState) {
      sandbox.innerHTML = savedState;
  }
  const savedHeader = localStorage.getItem(storageKeyHead);
  if (savedHeader) {
      overlayHeader.innerHTML = savedHeader;
  }

  const saveState = () => {
      localStorage.setItem(storageKeyBox, sandbox.innerHTML);
  };
  
  sandbox.addEventListener('input', saveState);
  sandbox.addEventListener('blur', saveState, true);
  
  overlayHeader.addEventListener('input', () => {
      localStorage.setItem(storageKeyHead, overlayHeader.innerHTML);
  });

  // Avatar Image Upload
  sandbox.addEventListener('click', (e) => {
      if (e.target.classList.contains('avatar')) {
          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.accept = 'image/*';
          fileInput.onchange = (event) => {
              const file = event.target.files[0];
              if (file) {
                  const reader = new FileReader();
                  reader.onload = (readEvent) => {
                      const base64Img = readEvent.target.result;
                      e.target.style.backgroundImage = `url(${base64Img})`;
                      e.target.innerHTML = '';
                      saveState(); 
                  };
                  reader.readAsDataURL(file);
              }
          };
          fileInput.click();
      }
  });


  // ==========================================
  // TAG MANAGEMENT (COLOR PICKER)
  // ==========================================
  const tagColors = ['novo', 'colchoes', 'kids', 'grupo', 'verde', 'laranja'];

  sandbox.addEventListener('click', (e) => {
      // Add new tag
      if (e.target.classList.contains('add-tag-btn')) {
          const tagsContainer = e.target.closest('.tags');
          if (tagsContainer) {
              const newTag = document.createElement('span');
              newTag.className = 'tag novo';
              newTag.innerHTML = `
                  <span class="tag-color-picker" title="Trocar Cor"></span>
                  <span class="tag-text" contenteditable="true">Nova</span>
              `;
              tagsContainer.insertBefore(newTag, e.target);
              newTag.querySelector('.tag-text').focus();
              saveState();
          }
      }

      // Change tag color
      if (e.target.classList.contains('tag-color-picker')) {
          const tag = e.target.closest('.tag');
          if (tag) {
              let currentClass = tagColors.find(c => tag.classList.contains(c)) || 'novo';
              let nextIndex = (tagColors.indexOf(currentClass) + 1) % tagColors.length;
              tag.classList.remove(currentClass);
              tag.classList.add(tagColors[nextIndex]);
              saveState();
          }
      }
  });

  // Remove empty tags
  sandbox.addEventListener('blur', (e) => {
      if (e.target.classList.contains('tag-text')) {
          if (e.target.innerText.trim() === '') {
              const tag = e.target.closest('.tag');
              if (tag) {
                  tag.remove();
                  saveState();
              }
          }
      }
  }, true);


  // ==========================================
  // ATRIBUIÇÕES (COLOR PICKER)
  // ==========================================
  sandbox.addEventListener('mousedown', (e) => {
      // Check if clicked inside attr-list li (na barra que fica na borda esquerda)
      if (e.target.tagName === 'LI' && e.target.closest('.attr-list')) {
          // A barra está no padding esquerdo (1.5rem = ~24px).
          // Se o clique foi no eixo X menor que 24, significa que foi em cima da barra
          if (e.offsetX < 24) { 
              e.preventDefault(); // Evita posicionar o cursor de texto lá
              
              const brands = ['', 'colchoes', 'kids', 'verde', 'laranja'];
              const currentBrand = e.target.getAttribute('data-brand') || '';
              let nextIndex = (brands.indexOf(currentBrand) + 1) % brands.length;
              
              if (brands[nextIndex]) {
                  e.target.setAttribute('data-brand', brands[nextIndex]);
              } else {
                  e.target.removeAttribute('data-brand');
              }
              saveState();
          }
      }
  });


  // ==========================================
  // DRAG AND DROP (ORG CHART E MARCAS)
  // ==========================================
  let draggedItem = null;

  sandbox.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('org-card') || e.target.classList.contains('b-member')) {
      draggedItem = e.target;
      setTimeout(() => e.target.classList.add('dragging'), 0);
    }
  });

  sandbox.addEventListener('dragend', (e) => {
    if (draggedItem) {
      draggedItem.classList.remove('dragging');
      draggedItem = null;
      document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
      saveState();
    }
  });

  sandbox.addEventListener('dragover', (e) => {
    e.preventDefault(); 
    
    // Org Chart Dropzones
    if (draggedItem && draggedItem.classList.contains('org-card')) {
        const dropzone = e.target.closest('.org-group');
        if (dropzone) {
            document.querySelectorAll('.org-group.drag-over').forEach(el => el.classList.remove('drag-over'));
            dropzone.classList.add('drag-over');
        }
    }

    // Brands Dropzones
    if (draggedItem && draggedItem.classList.contains('b-member')) {
        const dropzone = e.target.closest('.brand-members');
        if (dropzone) {
            document.querySelectorAll('.brand-members.drag-over').forEach(el => el.classList.remove('drag-over'));
            dropzone.classList.add('drag-over');
        }
    }
  });

  sandbox.addEventListener('drop', (e) => {
      e.preventDefault();
      
      // ORG CHART Drop
      if (draggedItem && draggedItem.classList.contains('org-card')) {
          const dropzone = e.target.closest('.org-group');
          if (dropzone) {
              dropzone.appendChild(draggedItem);
              dropzone.classList.remove('drag-over');
              saveState();
          }
      }

      // BRANDS Drop
      if (draggedItem && draggedItem.classList.contains('b-member')) {
          const dropzone = e.target.closest('.brand-members');
          if (dropzone) {
              dropzone.appendChild(draggedItem);
              dropzone.classList.remove('drag-over');
              saveState();
          }
      }
  });

});

window.resetData = function() {
  if (confirm("⚠️ Atenção: Tem certeza que deseja zerar todas as edições feitas na reunião e voltar ao padrão oficial?")) {
      localStorage.removeItem('grupoKeikoApp_Sandbox_v4');
      localStorage.removeItem('grupoKeikoApp_Header_v4');
      location.reload();
  }
}
