import gallery from './gallery-items.js';

const counter = (startIndex = 0) => {
  let index = startIndex - 1;

  return (incr = 1) => (index += incr);
};

const imageCounter = counter(0);

const makeGalleryItemMarkup = ({ preview, original, description }) => {
  return `<li class="gallery__item">
            <a class="gallery__link" href="${original}">
              <img
                class="gallery__image"
                src="${preview}"
                data-source="${original}"
                data-index="${imageCounter(1)}"
                alt="${description}"
              />
            </a>
          </li>`;
};

const LightBoxOpen = photoIndex => {
  const currentPhoto = refs.gallery.querySelector(
    `[data-index="${photoIndex}"]`,
  );

  refs.lightBox.classList.add('is-open');
  refs.lightBox.dataset.index = photoIndex;

  refs.lightBoxImg.src = currentPhoto.dataset.source;
  refs.lightBoxImg.alt = currentPhoto.alt;

  window.addEventListener('keydown', onKeyPressed);
  refs.lightBoxCloseBtn.addEventListener('click', LightBoxClose);
  refs.lightBoxOverlay.addEventListener('click', LightBoxClose);
};

const LightBoxClose = () => {
  refs.lightBox.classList.remove('is-open');
  refs.lightBox.removeAttribute('data-index');

  refs.lightBoxImg.src = '';
  refs.lightBoxImg.alt = '';

  window.removeEventListener('keydown', onKeyPressed);
  refs.lightBoxCloseBtn.removeEventListener('click', LightBoxClose);
  refs.lightBoxOverlay.removeEventListener('click', LightBoxClose);
};

const LightBoxImageSwipe = offset => {
  let nextIndex = Number(refs.lightBox.dataset.index) + offset;

  if (nextIndex < 0) {
    nextIndex = imageCounter(0);
  }
  if (nextIndex > imageCounter(0)) {
    nextIndex = 0;
  }

  refs.lightBox.dataset.index = nextIndex;
  const nextPhoto = refs.gallery.querySelector(`[data-index="${nextIndex}"]`);
  refs.lightBoxImg.src = nextPhoto.dataset.source;
  refs.lightBoxImg.alt = nextPhoto.alt;
};

const onPhotoClick = event => {
  event.preventDefault();

  const targetPhoto = event.target;
  if (!targetPhoto.classList.contains('gallery__image')) {
    return;
  }

  LightBoxOpen(targetPhoto.dataset.index);
};

const onKeyPressed = event => {
  if (
    event.key !== 'Escape' &&
    event.key !== 'ArrowLeft' &&
    event.key !== 'ArrowRight'
  ) {
    return;
  }

  let offset;

  switch (event.key) {
    case 'Escape':
      LightBoxClose();
      return;

    case 'ArrowRight':
      offset = 1;
      LightBoxImageSwipe(offset);
      return;

    case 'ArrowLeft':
      offset = -1;
      LightBoxImageSwipe(offset);
      return;
  }
};

const refs = {
  gallery: document.querySelector('.js-gallery'),
  lightBox: document.querySelector('.js-lightbox'),
  lightBoxOverlay: document.querySelector('.js-lightbox .lightbox__overlay'),
  lightBoxImg: document.querySelector('.js-lightbox .lightbox__image'),
  lightBoxCloseBtn: document.querySelector(
    '.js-lightbox button[data-action="close-lightbox"]',
  ),
};

const galleryMarkup = gallery.map(item => makeGalleryItemMarkup(item)).join('');

refs.gallery.insertAdjacentHTML('afterbegin', galleryMarkup);

refs.gallery.addEventListener('click', onPhotoClick);
