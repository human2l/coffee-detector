import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import styles from "../../styles/coffee-store.module.css";
import Image from "next/image";
import cls from "classnames";
import fetchCoffeeStores from "../../lib/coffee-store";
import { StoreContext } from "../../store/store-context";
import { isNotEmpty, imgPlaceholderUrl, swrFetcher } from "../../utils";
import useSWR from "swr";

export const getStaticProps = async (staticProps) => {
  const params = staticProps.params;
  const coffeeStores = await fetchCoffeeStores(null, 6);
  const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
    return coffeeStore.id.toString() === params.id;
  });
  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
};

export const getStaticPaths = async () => {
  const coffeeStores = await fetchCoffeeStores(null, 6);
  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: { id: coffeeStore.id.toString() },
    };
  });
  return {
    paths,
    fallback: true,
  };
};

const CoffeeStore = (initialProps) => {
  const router = useRouter();
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  const [votingCount, setVotingCount] = useState(0);
  const id = router.query.id;
  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const data = {
        ...coffeeStore,
        neighbourhood: coffeeStore.neighbourhood || "",
        address: coffeeStore.address || "",
        voting: 0,
      };
      await axios.post("/api/createCoffeeStore", data);
    } catch (error) {
      console.error("Error creating coffee store", error);
    }
  };

  useEffect(() => {
    if (isNotEmpty(initialProps.coffeeStore)) {
      console.log("not empty");
      console.log(initialProps.coffeeStore);
      // SSG
      handleCreateCoffeeStore(initialProps.coffeeStore);
      return;
    }

    // CSR
    if (coffeeStores.length > 0) {
      const coffeeStoreFromContext = coffeeStores.find(
        (coffeeStore) => coffeeStore.id.toString() === id
      );
      if (coffeeStoreFromContext) {
        setCoffeeStore(coffeeStoreFromContext);
        handleCreateCoffeeStore(coffeeStoreFromContext);
      }
    }
  }, [coffeeStores, id, initialProps, initialProps.coffeeStore]);

  const { data, error } = useSWR(
    `/api/getCoffeeStoreById?id=${id}`,
    swrFetcher
  );
  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);

  //Will show content placeholder during fetching
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  //Will show nothing but "Loading..." text
  // if (router.isFallback || !data) {
  //   return <div>Loading...</div>;
  // }

  const {
    address = "",
    name = "",
    neighbourhood = "",
    imgUrl = "",
  } = coffeeStore || {};

  const handleUpvoteButton = async () => {
    try {
      const data = {
        id,
      };
      const response = await axios.patch("/api/favouriteCoffeeStoreById", data);
      const dbCoffeeStore = response.data;

      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        setVotingCount(votingCount + 1);
      }
    } catch (error) {
      console.error("Error upvoting coffee store", error);
    }
  };

  if (error)
    <div>Something went wrong retrieving coffee store page: {error}</div>;
  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>↩︎ Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <p className={styles.name}>{name}</p>
          </div>
          <Image
            className={styles.storeImg}
            src={imgUrl || imgPlaceholderUrl}
            width="600"
            height="360"
            alt={name}
          />
        </div>
        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/place.svg"
              width="24"
              height="24"
              alt="address icon"
            />
            <p className={styles.text}>{address}</p>
          </div>
          {neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                width="24"
                height="24"
                alt="neighbourhood icon"
              />
              <p className={styles.text}>{neighbourhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width="24"
              height="24"
              alt="rating icon"
            />
            <p className={styles.text}>{votingCount}</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Like!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
