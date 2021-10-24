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
          <div className={styles.card}>
            <Link href="/sketches/ghost-drawing">
              <a>
                <h2>Ghost drawing</h2>
              </a>
            </Link>
          </div>
          <div className={styles.card}>
            <Link href="/sketches/bubbles">
              <a>
                <h2>Bubbles</h2>
              </a>
            </Link>
          </div>
          <div className={styles.card}>
            <Link href="/sketches/gasshan">
              <a>
                <h2>Gasshan</h2>
              </a>
            </Link>
          </div>
          <div className={styles.card}>
            <Link href="/sketches/hexagonal-gameoflife">
              <a>
                <h2>Hexagonal Game-of-Life</h2>
              </a>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
