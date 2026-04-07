const preview = document.getElementById('preview');
const previewImg = document.getElementById('preview-img');
const links = document.querySelectorAll('.month-link');

const PREVIEW_WIDTH =  320;
const PREVIEW_HEIGHT = 320;

links.forEach(link => {
  link.addEventListener('mouseenter', () => {
    const imgSrc = link.dataset.image;
    previewImg.src = imgSrc;
    //Get viewport size 
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    //Random position within viewport
    const maxX = vw - PREVIEW_WIDTH -20;
    const maxY = vh - PREVIEW_HEIGHT -20;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    
    preview.style.left = `${x}px`;
    preview.style.top = `${y}px`;

    const rotation = (Math.random()*10)-5;
    preview.style.transform = `rotate(${rotation}deg)`;
    
    preview.style.opacity = '1';

  })
  link.addEventListener('mouseleave', () => {
    preview.style.opacity = '0';
  });
});