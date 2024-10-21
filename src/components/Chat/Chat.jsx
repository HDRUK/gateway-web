/** @jsxImportSource @emotion/react */
// import Box from "../Box";
import { Box } from "@mui/material";
import BoxContainer from "../BoxContainer";
import * as styles from "./Chat.styles";

const Chat = ({ messages, currentUser }) => {
    return (
        <BoxContainer css={styles.chatContainer}>
            {messages?.map(message => {
                const isSentByCurrentUser = message.from === currentUser;

                return (
                    <Box
                        key={message.id}
                        css={[
                            styles.messageContainer,
                            isSentByCurrentUser ? styles.sent : styles.received,
                        ]}>
                        <Box css={styles.fromContainer}>{message.from}</Box>
                        <Box css={styles.messageBody}>
                            {message.message_body}
                        </Box>
                        <Box className={styles.timestamp}>
                            {new Date(message.created_at).toLocaleTimeString()}
                        </Box>
                    </Box>
                );
            })}
        </BoxContainer>
    );
};

export default Chat;
