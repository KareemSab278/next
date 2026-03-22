"use client";

import {
  Container,
  Title,
  Text,
  Badge,
  Button,
  Group,
  Stack,
  Loader,
  Center,
  Paper,
  Table,
  Image,
  SimpleGrid,
  Modal,
} from "@mantine/core";
import {
  IconGavel,
  IconClock,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAuctionById, getBidsForAuction, getAuctionImages } from "@/app/helpers";
import { BidModal } from "@/app/components/BidModal";
import { useAuth } from "@/app/context/AuthContext";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";

type Props = { params: { auction_id: string } };

export default function AuctionDetailPage({ params }: Props) {
  const id : number = parseInt(params.auction_id, 10);
  const { user } = useAuth();
  const router = useRouter();

  const [auction, setAuction] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [auctionImages, setAuctionImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidOpened, { open: openBid, close: closeBid }] = useDisclosure(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const openImageViewer = useCallback((index: number) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);
  const closeImageViewer = () => setIsViewerOpen(false);

  const showPrev = () => setCurrentImage((prev) => (prev === 0 ? auctionImages.length - 1 : prev - 1));
  const showNext = () => setCurrentImage((prev) => (prev === auctionImages.length - 1 ? 0 : prev + 1));

  const load = async () => {
    try {
      const [auctionData, bidsData, imagesData] = await Promise.all([
        getAuctionById(id),
        getBidsForAuction(id),
        getAuctionImages(id),
      ]);
      setAuction(auctionData);
      setBids(bidsData ?? []);
      setAuctionImages(imagesData ?? []);
    } catch (err: any) {
      showNotification?.({
        title: "Error loading auction",
        message: err?.message || "Unknown error",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return (
    <Center h="60vh"><Loader size="xl" /></Center>
  );

  if (!auction) return (
    <Center h="60vh">
      <Stack align="center" gap="sm">
        <Text c="dimmed">Auction not found</Text>
        <Button variant="subtle" onClick={() => router.push("/auctions")}>
          Back to auctions
        </Button>
      </Stack>
    </Center>
  );

  // ...rest of your render stays same, with router.push("/login") etc
}