import styles from "./page.module.css";
import { Button } from "@mantine/core";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Home Page</h1>
        <Button component="a" href="/auctions" mb="md">
          View Auctions
        </Button>
      </main>
    </div>
  );
}
