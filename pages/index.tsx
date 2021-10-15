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
          <Link href="/sketches/ghost-drawing">
            <a className={styles.card} style={{ width: 250 }}>
              <h2>Ghost drawing</h2>
            </a>
          </Link>
        </div>
      </main>

      <main className={styles.main}>
        <div className={styles.grid}>
          <Link href="/sketches/bubbles">
            <a className={styles.card} style={{ width: 250 }}>
              <h2>Bubbles</h2>
            </a>
          </Link>
        </div>
      </main>

      <main className={styles.main}>
        <div className={styles.grid}>
          <Link href="/sketches/shapes">
            <a className={styles.card} style={{ width: 250 }}>
              <h2>Shapes</h2>
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
}
