import styles from "./banner.module.css";

const banner = (props) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>
        <span className={styles.title1}>Coffee</span>
        <span className={styles.title2}>Detector</span>
      </h1>
      <p className={styles.subTitle}>Get your nearest coffee shops!</p>
      <button className={styles.button} onClick={props.handleOnClick}>
        {props.buttonText}
      </button>
    </div>
  );
};

export default banner;
