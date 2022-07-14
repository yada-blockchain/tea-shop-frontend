import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Mini Tea Shop - Buy my tea</title>
        <meta name="description" content="my tea shop" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
}
