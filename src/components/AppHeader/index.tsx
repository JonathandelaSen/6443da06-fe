import {
  Grow,
  Box,
  Button,
  Menu,
  MenuItem,
  Theme,
  Toolbar,
  Typography
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import { mdiTranslate, mdiCheck, mdiChevronDown } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { User } from "../../api/services/User/store";
import AvatarMenu from "../AvatarMenu";

interface AppBarProps extends MuiAppBarProps {
  theme?: Theme;
}

interface AppHeaderProps {
  user: User;
  pageTitle: string;
}

const typoStyle = {
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
  lineHeight: 1
};

const AppBar = styled(MuiAppBar)<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  height: theme.tokens.header.height
}));

const AppHeader = React.forwardRef((props: AppHeaderProps, ref) => {
  const { user, pageTitle } = props;
  const { i18n, t } = useTranslation("app");
  const theme = useTheme();
  const language = i18n.resolvedLanguage?.split("-")[0] || "en";

  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);
  const langMenuOpen = Boolean(langAnchorEl);

  const handleLangClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLangClose = () => {
    setLangAnchorEl(null);
  };

  const handleLangChange = (newLang: string) => {
    i18n.changeLanguage(newLang);
    handleLangClose();
  };

  const [count, setCount] = useState(0);
  const hours = 1;
  const minutes = hours * 60;
  const seconds = minutes * 60;
  const finished = count >= seconds;
  const countdown = Math.max(seconds - count, 0);
  const countdownMinutes = `${~~(countdown / 60)}`.padStart(2, "0");
  const countdownSeconds = (countdown % 60).toFixed(0).padStart(2, "0");

  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => {
      setCount((c) => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [finished]);

  return (
    <AppBar ref={ref} position="fixed" sx={{ width: "100vw" }}>
      <Toolbar sx={{ background: "#08140C 0% 0% no-repeat padding-box" }}>
        <Box sx={{ width: "100%", flexDirection: "row", display: "flex" }}>
          <Box>
            <Typography variant="h6" component="div" color="primary">
              {countdownMinutes}:{countdownSeconds}
            </Typography>
          </Box>
          <Box sx={{ width: 20, height: 20, flex: 1 }} />
          <Box sx={{ flex: 2 }}>
            <Typography
              sx={{
                ...typoStyle,
                color: theme.palette.primary.main,
                mb: theme.spacing(0.5)
              }}
              variant="h6"
              component="div"
            >
              {t("appTitle").toLocaleUpperCase()}
            </Typography>
            <Typography
              sx={{ ...typoStyle }}
              variant="overline"
              component="div"
              noWrap
            >
              {pageTitle.toLocaleUpperCase()}
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
              display: "flex",
              gap: 2
            }}
          >
            <Box>
              <Button
                id="language-select-button"
                aria-controls={langMenuOpen ? "language-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={langMenuOpen ? "true" : undefined}
                onClick={handleLangClick}
                variant="text"
                startIcon={<Icon path={mdiTranslate} size={0.75} />}
                endIcon={<Icon path={mdiChevronDown} size={0.6} />}
                sx={{
                  color: "common.white",
                  textTransform: "none",
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.5,
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  transition: "all 0.2s ease-in-out",
                  fontSize: "0.875rem",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    borderColor: "rgba(255, 255, 255, 0.25)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                  }
                }}
              >
                {language === "en" ? "English" : "Deutsch"}
              </Button>
              <Menu
                id="language-menu"
                anchorEl={langAnchorEl}
                open={langMenuOpen}
                onClose={handleLangClose}
                MenuListProps={{
                  "aria-labelledby": "language-select-button"
                }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    backgroundColor: "rgba(20, 20, 20, 0.9)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 2,
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                    "& .MuiMenuItem-root": {
                      color: "rgba(255, 255, 255, 0.8)",
                      borderRadius: 1.5,
                      mx: 0.5,
                      my: 0.25,
                      py: 1,
                      px: 1.5,
                      fontSize: "0.875rem",
                      transition: "all 0.15s ease-in-out",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      minWidth: 140,
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        color: "common.white"
                      },
                      "&.Mui-selected": {
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        color: "common.white",
                        fontWeight: 600,
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.2)"
                        }
                      }
                    }
                  }
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right"
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
              >
                <MenuItem
                  selected={language === "en"}
                  onClick={() => handleLangChange("en")}
                >
                  <span>English</span>
                  {language === "en" && (
                    <Icon path={mdiCheck} size={0.7} style={{ marginLeft: 8 }} />
                  )}
                </MenuItem>
                <MenuItem
                  selected={language === "de"}
                  onClick={() => handleLangChange("de")}
                >
                  <span>Deutsch</span>
                  {language === "de" && (
                    <Icon path={mdiCheck} size={0.7} style={{ marginLeft: 8 }} />
                  )}
                </MenuItem>
              </Menu>
            </Box>
            {user && user.eMail && (
              <Grow in={Boolean(user && user.eMail)}>
                <AvatarMenu user={user} />
              </Grow>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
});

export default AppHeader;
