import {
  findRecordByFilter,
  getMinifiedRecords,
  table,
} from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
  //find a record
  try {
    if (req.method === "POST") {
      const { id, name, neighbourhood, address, imgUrl, voting } = req.body;
      if (!id) {
        res.status(400);
        return res.json({ message: "Id is missing" });
      }

      const foundRecords = await findRecordByFilter(id);
      if (foundRecords.length !== 0) return res.json(foundRecords);

      //create a record
      if (!name) {
        res.status(400);
        return res.json({ message: "Name is missing" });
      }
      const createRecords = await table.create([
        {
          fields: {
            id,
            name,
            neighbourhood,
            address,
            imgUrl,
            voting,
          },
        },
      ]);
      const records = getMinifiedRecords(createRecords);

      return res.json(records);
    } else {
      return res.json({ message: "this is get" });
    }
  } catch (error) {
    console.error("Error creating or finding store", error);
    res.status(500);
    return res.json({ message: "Error creating or finding store", error });
  }
};

export default createCoffeeStore;
