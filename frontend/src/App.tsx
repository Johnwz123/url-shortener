import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useEffect } from "react";
import { UrlShortenerForm } from "./components/UrlShortenerForm";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ROUTES } from "./routes";

const theme = createTheme({});

type AppProps = {
  apiBaseUrl: string;
  routePath?: string;
};

const RedirectToHome = () => {
  useEffect(() => {
    window.location.replace(ROUTES.home);
  }, []);

  return null;
};

const renderRoute = (apiBaseUrl: string, routePath: string) => {
  switch (routePath) {
    case ROUTES.home:
      return <UrlShortenerForm apiBaseUrl={apiBaseUrl} />;
    case ROUTES.notFound:
      return <NotFoundPage />;
    default:
      return <RedirectToHome />;
  }
};

export const App = ({ apiBaseUrl, routePath = window.location.pathname }: AppProps) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {renderRoute(apiBaseUrl, routePath)}
  </ThemeProvider>
);
