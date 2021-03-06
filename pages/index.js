import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import Banner from "../components/banner";
import Card from "../components/card";
import fetchCoffeeStores from "../lib/coffee-store";
import styles from "../styles/Home.module.css";
import useTrackLocation from "../hooks/use-track-location";
import { useState, useEffect, useContext } from "react";
import { ACTION_TYPES, StoreContext } from "../store/store-context";
import { imgPlaceholderUrl } from "../utils";

export async function getStaticProps(context) {
  try {
    const coffeeStores = await fetchCoffeeStores(null, 6);
    return {
      props: {
        coffeeStores,
      },
    };
  } catch (error) {
    console.error(error);
  }
}

export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();
  const [coffeeStoresError, setCoffeeStoresError] = useState("");

  const { dispatch, state } = useContext(StoreContext);

  const { coffeeStores, latLong } = state;
  useEffect(() => {
    const effectFn = async () => {
      if (latLong) {
        try {
          const response = await axios.get(
            `/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`
          );
          const coffeeStores = response.data;
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              coffeeStores,
            },
          });
          setCoffeeStoresError("");
        } catch (error) {
          setCoffeeStoresError(error.message);
        }
      }
    };
    effectFn();
  }, [dispatch, latLong]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Detector</title>
        <meta
          name="description"
          content="Help you find the coffee store you need"
        />
        <link rel="icon" href="/favicons/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Locating..." : "Show me"}
          handleOnClick={handleTrackLocation}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="hero-image"
          />
        </div>
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => (
                <Card
                  key={coffeeStore.id}
                  name={coffeeStore.name}
                  imgUrl={coffeeStore.imgUrl || imgPlaceholderUrl}
                  href={`/coffee-store/${coffeeStore.id}`}
                  className={styles.card}
                />
              ))}
            </div>
          </div>
        )}
        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Sydney Stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStore) => (
                <Card
                  key={coffeeStore.id}
                  name={coffeeStore.name}
                  imgUrl={coffeeStore.imgUrl || imgPlaceholderUrl}
                  href={`/coffee-store/${coffeeStore.id}`}
                  className={styles.card}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
