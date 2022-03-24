import {
  table,
  findRecordByFilter,
  getMinifiedRecords,
} from "../../lib/airtable";

const favouriteCoffeeStoreById = async (req, res) => {
  if (req.method === "PATCH") {
    try {
      const { id } = req.body;
      if (!id) {
        res.status(400);
        return res.json({ message: "Id is missing", id });
      }
      const records = await findRecordByFilter(id);
      if (records.length === 0) {
        res.status(400);
        return res.json({ message: "Coffee store id doesn't exist", id });
      }
      const record = records[0];
      const calculateVoting = Number(record.voting) + 1;
      const updateRecord = await table.update([
        {
          id: record.recordId,
          fields: {
            voting: calculateVoting,
          },
        },
      ]);

      if (updateRecord) {
        const minifiedRecords = getMinifiedRecords(updateRecord);
        return res.json(minifiedRecords);
      }
    } catch (error) {
      res.status(500);
      return res.json({ message: "Error upvoting coffee store", error });
    }
  }
};

export default favouriteCoffeeStoreById;
