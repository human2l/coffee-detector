import { getMinifiedRecords, table } from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
  //find a record
  try {
    if (req.method === "POST") {
      const { id, name, neighbourhood, address, imgUrl, voting } = req.body;
      if (!id) {
        res.status(400);
        return res.json({ message: "Id is missing" });
      }

      const findCoffeeStoreRecords = await table
        .select({
          filterByFormula: `id=${id}`,
        })
        .firstPage();
      if (findCoffeeStoreRecords.length !== 0) {
        const records = getMinifiedRecords(findCoffeeStoreRecords);
        return res.json(records);
      }
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
      res.json({ message: "this is get" });
    }
  } catch (error) {
    console.error("Error creating or finding store", error);
    res.status(500);
    return res.json({ message: "Error creating or finding store", error });
  }
};

export default createCoffeeStore;
