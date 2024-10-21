import { css } from "@emotion/react";
import { colors } from "@/config/theme";

export const chatContainer = css({
    display: "flex",
    flexDirection: "column",
    padding: 20,
    margin: 10,
    // maxWidth: "600px",
    // margin: "0 auto",
    // height: "80vh",
    // overflowY: "scroll",
    borderRadius: "8px",
    backgroundColor: colors.grey100, // Adjust this to your theme's background color
});

export const messageContainer = css({
    margin: 5,
    padding: 10,
    maxWidth: "80%",
    borderRadius: 10,
});

export const fromContainer = css({
    fontWeight: "bold",
    fontSize: "0.85rem",
    marginBottom: "5px", // Adds spacing between the "from" and the message body
});

export const sent = css({
    alignSelf: "flex-end",
    backgroundColor: colors?.sentMessageBackground || "#dcf8c6", // Adjust based on your theme
    textAlign: "right",
});

export const received = css({
    alignSelf: "flex-start",
    backgroundColor: colors?.receivedMessageBackground || "#ffffff", // Adjust based on your theme
    textAlign: "left",
});

export const messageBody = css({
    fontSize: "16px",
    lineHeight: 1.5,
});

export const timestamp = css({
    fontSize: "12px",
    color: colors?.timestampText || "#888", // Adjust to match your theme's color scheme
    marginTop: "5px",
});
