import Head from "next/head";
import Image from "next/image";
import Banner from "../components/banner";
import Card from "../components/card";
import fetchCoffeeStores from "../lib/coffee-store";
import styles from "../styles/Home.module.css";
import useTrackLocation from "../hooks/use-track-location";
import { useState, useEffect } from "react";

export async function getStaticProps(context) {
  try {
    const coffeeStores = await fetchCoffeeStores();
    return {
      props: {
        coffeeStores,
      },
    };
  } catch (error) {
    console.log(error);
  }
}

export default function Home(props) {
  const { handleTrackLocation, latLong, locationErrorMsg, isFindingLocation } =
    useTrackLocation();
  const [coffeeStores, setCoffeeStores] = useState([]);
  const [coffeeStoresError, setCoffeeStoresError] = useState("");

  useEffect(() => {
    const effectFn = async () => {
      if (latLong) {
        try {
          const fetchedCoffeeStores = await fetchCoffeeStores(latLong);
          setCoffeeStores(fetchedCoffeeStores);
        } catch (error) {
          setCoffeeStoresError(error.message);
        }
      }
    };
    effectFn();
  }, [latLong]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Detector</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Locating..." : "Show me"}
          handleOnClick={handleTrackLocation}
        />
        {locationErrorMsg && <p>Something went wrong: ${locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong: ${coffeeStoresError}</p>}
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
                  imgUrl={
                    coffeeStore.imgUrl ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
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
                  imgUrl={
                    coffeeStore.imgUrl ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
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
