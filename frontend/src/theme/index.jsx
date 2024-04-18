import React, { useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";

export default function ThemeCustomization({ children }) {
    // Use useMemo to memoize the theme object for better performance
    const darkTheme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: "dark",
                },
            }),
        [],
    ); // Dependencies array is empty, meaning the theme is only created once

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </StyledEngineProvider>
    );
}
