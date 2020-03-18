import React from "react";
import "./page.css";
import { Container, Toolbar } from "@material-ui/core";

export function Page({ children, bcolor }) {
  return (
    <Container style={{ padding: 0 }}>
      <Toolbar />{" "}
      {/* this pads the content so it doesn't go under the app bar */}
      <div
        className="typography"
        style={{
          backgroundColor: bcolor ?? "#fff"
        }}
      >
        {children}
      </div>
    </Container>
  );
}
