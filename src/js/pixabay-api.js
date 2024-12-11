import axios from 'axios';

const API_KEY = '47467192-b15a855f7913b17ade7ea6ded';
const BASE_URL = 'https://pixabay.com/api/';

export const fetchImages = async (query, page, perPage = 15) => {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: perPage,
  };

  const { data } = await axios.get(BASE_URL, { params });
  return data;
};
