import { Alert, Box, Button, Container, Link, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import type { SyntheticEvent } from "react";
import { ApiClientError, createShortUrl } from "../api";
import type { CreateShortUrlResponse } from "../api";

type UrlShortenerFormProps = {
  apiBaseUrl: string;
};

export const UrlShortenerForm = ({ apiBaseUrl }: UrlShortenerFormProps) => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [result, setResult] = useState<CreateShortUrlResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
    setFieldErrors({});
    setFormError("");
    setResult(null);

    if (shortCode.trim().length === 0) {
      setFieldErrors({ shortCode: "Enter a short code." });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createShortUrl(
        {
          originalUrl,
          shortCode,
        },
        apiBaseUrl,
      );
      setResult(response);
    } catch (error) {
      if (error instanceof ApiClientError) {
        setFieldErrors(error.fieldErrors ?? {});

        switch (error.code) {
          case "SHORT_CODE_TAKEN":
            setFormError("This short code is already taken. Choose a different short code.");
            break;
          default:
            setFormError(error.message);
        }
      } else {
        setFormError("Something went wrong.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Stack component="main" spacing={3} sx={{ width: "100%" }}>
          <Stack spacing={1}>
            <Typography variant="h4" component="h1">
              URL Shortener
            </Typography>
            <Typography color="text.secondary">
              Create a short link with your own code.
            </Typography>
          </Stack>

          <Stack component="form" spacing={2} onSubmit={handleSubmit} noValidate>
            <TextField
              label="Original URL"
              value={originalUrl}
              onChange={(event) => setOriginalUrl(event.target.value)}
              error={Boolean(fieldErrors.originalUrl)}
              helperText={fieldErrors.originalUrl}
              required
              fullWidth
            />
            <TextField
              label="Short code"
              value={shortCode}
              onChange={(event) => setShortCode(event.target.value.toLowerCase())}
              error={Boolean(fieldErrors.shortCode)}
              helperText={fieldErrors.shortCode}
              required
              fullWidth
            />

            {formError ? <Alert severity="error">{formError}</Alert> : null}

            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create short URL"}
            </Button>
          </Stack>

          {result ? (
            <Alert severity="success">
              <Stack spacing={0.5}>
                <Typography component="span">Short URL created</Typography>
                <Link href={result.shortUrl}>{result.shortUrl}</Link>
              </Stack>
            </Alert>
          ) : null}
        </Stack>
      </Box>
    </Container>
  );
};
