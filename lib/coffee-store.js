import axios from "axios";
//initialize unsplash
import { createApi } from "unsplash-js";

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (query, near, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&near=${near}&limit=${limit}`;
};

const getUrlForNearbyCoffeeStores = (query, latLong, limit) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&query=${query}&limit=${limit}`;
};

const getCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee store",
    perPage: 40,
    orientation: "landscape",
  });
  const unsplashResults = photos.response.results;
  const photoResponse = unsplashResults.map((result) => result.urls["small"]);
  return photoResponse;
};

const fetchCoffeeStores = async (latLong, limit) => {
  const photos = await getCoffeeStorePhotos();

  const config = {
    headers: {
      Accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_AUTHORIZATION_HEADER,
    },
  };
  let response;
  if (latLong) {
    response = await axios.get(
      getUrlForNearbyCoffeeStores("coffee", latLong, limit),
      config
    );
  } else {
    response = await axios.get(
      getUrlForCoffeeStores("coffee", "sydney", limit),
      config
    );
  }

  const data = response.data;
  const coffeeStores = data.results.map((coffeeStore, index) => {
    return {
      name: coffeeStore.name,
      id: coffeeStore.fsq_id,
      address: coffeeStore.location.address,
      neighbourhood: coffeeStore.location.neighborhood?.toString() || null,
      imgUrl: photos[index],
    };
  });
  return coffeeStores;
};

export default fetchCoffeeStores;
