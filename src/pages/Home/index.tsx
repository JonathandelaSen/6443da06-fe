import { Box, Container, Typography } from "@mui/material";
import { observer } from "mobx-react";
import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Trans, useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation("app");
  const issues = [
    {
      id: "missing-key-prop",
      icon: "🐞",
      completed: true
    },
    {
      id: "bold-known-word",
      icon: "🐞",
      completed: true
    },
    {
      id: "missing-user-avatar",
      icon: "🐞",
      completed: true
    },
    {
      id: "broken-countdown",
      icon: "🐞",
      completed: true
    },
    {
      id: "language-switcher",
      icon: "⭐️",
      completed: true
    }
  ];

  return (
    <Box p={2} maxHeight="calc(100vh - 64px)" overflow={["auto", "auto"]}>
      <Container>
        <Typography variant="h1" textAlign="center">
          {t("home.welcome")}
        </Typography>
        <Typography variant="subtitle1" textAlign="center">
          <Trans i18nKey="home.intro" components={{ b: <strong /> }} />{" "}
        </Typography>
        <Typography variant="body2" textAlign="center" color="textSecondary">
          {t("home.sidenote")}
        </Typography>
        <List>
          {issues.map((issue) => (
            <ListItem key={issue.id}>
              <Typography variant="h5" sx={{ p: 2 }}>
                {issue.icon}
              </Typography>
              <ListItemText
                primary={t(`home.issues.${issue.id}.title`)}
                secondary={t(`home.issues.${issue.id}.description`)}
                sx={{
                  textDecoration: issue.completed ? "line-through" : "none"
                }}
              />
            </ListItem>
          ))}
        </List>
      </Container>
    </Box>
  );
};

export default observer(Home);
