import fetchCoffeeStores from "../../lib/coffee-store";

const getCoffeeStoresByLocation = async (req, res) => {
  try {
    const { latLong, limit } = req.query;
    const response = await fetchCoffeeStores(latLong, 30);
    res.status(200);
    return res.json(response);
  } catch (error) {
    console.error("There is an error:", error);
    res.status(500);
    return res.json({ message: "Something went wrong", error });
  }
};

export default getCoffeeStoresByLocation;
