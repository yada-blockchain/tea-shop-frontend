import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header";
import MainPage from "../components/MainPage";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Mini Tea Shop - Buy my tea</title>
        <meta name="description" content="my tea shop" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <MainPage />
    </div>
  );
}
