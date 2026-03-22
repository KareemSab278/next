"use client";
import { useState } from "react";
import { Drawer, NavLink, Box, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { routes } from "../routes";

export default function DrawerComponent() {
  const [opened, { toggle }] = useDisclosure();
  const [active, setActive] = useState(0);

  const items = routes.map((item, index) => (
    <NavLink
      key={item.label}
      label={item.label}
      active={index === active}
      onClick={() => setActive(index)}
      component="a"
      href={item.route}
      color="black"
    />
  ));

  return (
    <>
      <div style={{ backgroundColor: "black" }}>
        <Burger
          size="xl"
          opened={opened}
          onClick={toggle}
          aria-label="Toggle navigation"
          styles={{
            root: {
              "--burger-color": "white",
              "--burger-line-size": "2px"
            },
          }}
        />
      </div>

      <Drawer
        opened={opened}
        onClose={toggle}
        size="xs"
        withCloseButton={false}
        styles={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
          content: { backgroundColor: "#1f1f1f", color: "#eee" },
          body: { backgroundColor: "#1f1f1f" },
          header: {
            backgroundColor: "#181818",
            borderBottom: "1px solid #333",
          },
        }}
      >
        <Box>{items}</Box>
      </Drawer>
    </>
  );
}
