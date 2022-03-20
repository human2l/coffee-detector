//initialize unsplash
import { createApi } from "unsplash-js";

const unsplashApi = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (query, near, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&near=${near}&limit=${limit}`;
};

const getCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee store",
    perPage: 10,
    orientation: "landscape",
  });
  const unsplashResults = photos.response.results;
  const photoResponse = unsplashResults.map((result) => result.urls["small"]);
  return photoResponse;
};

const fetchCoffeeStores = async () => {
  const photos = await getCoffeeStorePhotos();

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.FOURSQUARE_AUTHORIZATION_HEADER,
    },
  };
  const response = await fetch(
    getUrlForCoffeeStores("coffee", "sydney", 6),
    options
  );

  const data = await response.json();
  const coffeeStores = data.results.map((coffeeStore, index) => {
    return {
      name: coffeeStore.name,
      id: coffeeStore.fsq_id,
      address: coffeeStore.location.address,
      neighbourhood: coffeeStore.location.neighborhood || null,
      imgUrl: photos[index],
    };
  });
  return coffeeStores;
};

export default fetchCoffeeStores;
