import { getMinifiedRecords, table } from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;
  try {
    if (!id) {
      res.status(400);
      return res.json({ message: "Id is missing" });
    }
    const findCoffeeStoreRecords = await table
      .select({
        filterByFormula: `id="${id}"`,
      })
      .firstPage();
    if (findCoffeeStoreRecords.length !== 0) {
      const records = getMinifiedRecords(findCoffeeStoreRecords);
      return res.json(records);
    }
    return res.json({ message: `id:${id} could not be found` });
  } catch (error) {
    res.status(500);
    return res.json({ message: "Something went wrong", error });
  }
};

export default getCoffeeStoreById;
