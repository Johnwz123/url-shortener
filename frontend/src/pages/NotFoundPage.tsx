import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { ROUTES } from "../routes";

export const NotFoundPage = () => (
  <Container maxWidth="sm">
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack spacing={3} alignItems="flex-start">
        <Typography variant="h1" sx={{ fontSize: "3rem", fontWeight: 700 }}>
          404
        </Typography>
        <Typography variant="h5" component="h2">
          Short link not found
        </Typography>
        <Typography color="text.secondary">
          This short link does not exist or is no longer available.
        </Typography>
        <Button href={ROUTES.home} variant="contained">
          Create a link
        </Button>
      </Stack>
    </Box>
  </Container>
);
