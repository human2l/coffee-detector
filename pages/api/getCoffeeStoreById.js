import {
  findRecordByFilter,
  getMinifiedRecords,
  table,
} from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;
  try {
    if (!id) {
      res.status(400);
      return res.json({ message: "Id is missing" });
    }
    const records = await findRecordByFilter(id);
    return records.length !== 0
      ? res.json(records)
      : res.json({ message: `id:${id} could not be found` });
  } catch (error) {
    res.status(500);
    return res.json({ message: "Something went wrong", error });
  }
};

export default getCoffeeStoreById;
