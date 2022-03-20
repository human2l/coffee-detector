const getUrlForCoffeeStores = (query, near, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&near=${near}&limit=${limit}`;
};

const fetchCoffeeStores = async () => {
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
  return data.results;
};

export default fetchCoffeeStores;
