import { useRouter } from "next/router";
import Link from "next/link";
import coffeeStoresData from "../../data/coffee-stores.json";

export const getStaticProps = async (staticProps) => {
  const params = staticProps.params;
  return {
    props: {
      coffeeStore: coffeeStoresData.find((coffeeStore) => {
        return coffeeStore.id.toString() === params.id;
      }),
    },
  };
};

export const getStaticPaths = async () => {
  return {
    paths: [{ params: { id: "0" } }, { params: { id: "1" } }],
    fallback: true,
  };
};

const CoffeeStore = (props) => {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      CoffeeStore {router.query.id}
      <Link href="/">
        <a>Back to home</a>
      </Link>
      <p>{props.coffeeStore.id}</p>
      <p>{props.coffeeStore.name}</p>
    </div>
  );
};

export default CoffeeStore;
