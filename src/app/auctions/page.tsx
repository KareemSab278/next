import styles from "../page.module.css";
import { AuctionCard } from "../components/AuctionCard";
import { mockAuctions } from "../auctionCardMockData";
import { Button } from "@mantine/core";

export default function Auctions() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Button component="a" href="/" mb="md">
          Back to Home
        </Button>
        <h1>Auctions Page</h1>
        {mockAuctions.map((auction) => (
        <AuctionCard key={auction.auction_id} auction={auction} />
      ))}
      </main>
    </div>
  );
}
