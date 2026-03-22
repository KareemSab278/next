export const mockAuctions = [
  {
    auction_id: 1,
    title: "Vintage Pocket Watch",
    description: "Classic 1920s Rolex pocket watch in excellent condition.",
    starting_price: 125.0,
    current_price: 245.5,
    end_time: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(), // 3 days
    is_active: true,
  },
  {
    auction_id: 2,
    title: "Signed Football Jersey",
    description: "Autographed by a legendary player, includes COA.",
    starting_price: 250.0,
    current_price: 590.0,
    end_time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // ended 5h ago
    is_active: false,
  },
  {
    auction_id: 3,
    title: "High-End Gaming Laptop",
    description: "",
    starting_price: 1400.0,
    current_price: 1825.0,
    end_time: new Date(Date.now() + 1000 * 60 * 60 * 14).toISOString(), // 14h
    is_active: true,
  },
];