import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import styles from "../../styles/coffee-store.module.css";
import Image from "next/image";
import cls from "classnames";
import fetchCoffeeStores from "../../lib/coffee-store";
import { StoreContext } from "../../store/store-context";
import { isEmpty } from "../../utils";

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
      const response = await axios.post("/api/createCoffeeStore", data);
      console.log(response);
      // const response = await fetch("/api/createCoffeeStore", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // });
      // console.log(response);
    } catch (error) {
      console.error("Error creating coffee store", error);
    }
  };

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find(
          (coffeeStore) => coffeeStore.id.toString() === id
        );
        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    }
  }, [coffeeStores, id, initialProps.coffeeStore]);

  const { address, name, neighbourhood, imgUrl } = coffeeStore;

  const handleUpvoteButton = () => {
    console.log("handle upvote");
  };

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

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
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
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
            <p className={styles.text}>1</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Like
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
