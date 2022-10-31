import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>CC</title>
        <meta name="description" content="creative coding gallery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.grid}>
          <Link href="/sketches/ghost-drawing" className={styles.card}>
            <h2>Ghost drawing</h2>
          </Link>
          <Link href="/sketches/bubbles" className={styles.card}>
            <h2>Bubbles</h2>
          </Link>
          <Link href="/sketches/gasshan" className={styles.card}>
            <h2>Gasshan</h2>
          </Link>
          <Link href="/sketches/hexagonal-gameoflife" className={styles.card}>
            <h2>Hexagonal Game-of-Life</h2>
          </Link>
        </div>
      </main>
    </div>
  );
}
