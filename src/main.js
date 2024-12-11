import { fetchImages } from './js/pixabay-api';
import {
  renderImageCards,
  clearGallery,
  appendImagesToGallery,
} from './js/render-functions';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.createElement('button');

loadMoreBtn.textContent = 'Load more';
loadMoreBtn.classList.add('btn');
loadMoreBtn.style.display = 'none';
document.body.appendChild(loadMoreBtn);

let lightbox = new SimpleLightbox('.gallery a');
let query = '';
let page = 1;
let totalHits = 0;

const handleSearch = async event => {
  event.preventDefault();

  query = searchForm.querySelector('input').value.trim();
  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query!',
    });
    return;
  }

  page = 1;
  clearGallery();
  loader.style.display = 'block';
  loadMoreBtn.style.display = 'none';

  try {
    const data = await fetchImages(query, page);
    totalHits = data.totalHits;

    loader.style.display = 'none';

    if (data.hits.length === 0) {
      iziToast.info({
        title: 'Sorry',
        message: 'There are no images matching your search query.',
      });
      return;
    }

    iziToast.success({
      title: 'Success',
      message: `Found ${totalHits} images!`,
    });

    const markup = renderImageCards(data.hits);
    appendImagesToGallery(markup);
    lightbox.refresh();
    if (totalHits > 15) loadMoreBtn.style.display = 'block';
  } catch (error) {
    loader.style.display = 'none';
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
    });
  }
};

const loadMoreImages = async () => {
  page += 1;
  loader.style.display = 'block';

  try {
    const data = await fetchImages(query, page);
    loader.style.display = 'none';

    const markup = renderImageCards(data.hits);
    appendImagesToGallery(markup);
    lightbox.refresh();

    const { height: cardHeight } =
      gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (page * 15 >= totalHits) {
      loadMoreBtn.style.display = 'none';
      iziToast.info({
        title: 'End of results',
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch (error) {
    loader.style.display = 'none';
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
    });
  }
};

searchForm.addEventListener('submit', handleSearch);
loadMoreBtn.addEventListener('click', loadMoreImages);
