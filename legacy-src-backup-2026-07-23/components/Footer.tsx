import React from "react";
import { Link } from "react-router-dom";
import { Box, Container, Grid, Typography, styled } from "@mui/material";
import { t } from "../utils/translationUtils";

const StyledLink = styled(Link)({
  color: "#f5e6d3",
  textDecoration: "none",
  "&:hover": {
    color: "#e0c9a6",
  },
});

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#d35400",
        color: "#f5e6d3",
        py: 6,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "#f5e6d3", fontWeight: "bold" }}
            >
              {t("temple.name")}
            </Typography>
            <Typography variant="body2" sx={{ color: "#f5e6d3" }}>
              {/* {t('temple.description')} */}A sacred place of worship
              dedicated to Goddess Kalambadevi, serving our community with
              devotion since 1892. Experience divine blessings and spiritual
              peace in our traditional temple atmosphere.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "#f5e6d3", fontWeight: "bold" }}
            >
              {t("temple.timings")}
            </Typography>
            <div className=" rounded text-white">
              <div className="d-flex justify-content-between small mb-1">
                <span>Morning Aarti:</span>
                <span className="text-warning">6:00 AM</span>
              </div>
              <div className="d-flex justify-content-between small mb-1">
                <span>Darshan:</span>
                <span className="text-warning">6:30 AM - 8:30 PM</span>
              </div>
              <div className="d-flex justify-content-between small mb-1">
                <span>Evening Aarti:</span>
                <span className="text-warning">7:00 PM</span>
              </div>
              <div className="d-flex justify-content-between small">
                <span>Prasadam:</span>
                <span className="text-warning">12:00 - 2:00 PM</span>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "#f5e6d3", fontWeight: "bold" }}
            >
              {t("temple.services")}
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <StyledLink to="/donations">{t("temple.donations")}</StyledLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <StyledLink to="/prayer-books">
                  {t("temple.prayerBooks")}
                </StyledLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <StyledLink to="/virtual-visit">
                  {t("temple.virtualVisit")}
                </StyledLink>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "#f5e6d3", fontWeight: "bold" }}
            >
              {t("common.contact")}
            </Typography>
            <Typography variant="body2" paragraph sx={{ color: "#f5e6d3" }}>
              Address : {t("temple.address")}
            </Typography>
            <Typography variant="body2" paragraph sx={{ color: "#f5e6d3" }}>
              Phone : {t("temple.phone")}
            </Typography>
            <Typography variant="body2" sx={{ color: "#f5e6d3" }}>
              Email : {t("temple.email")}
            </Typography>
          </Grid>
        </Grid>
        <Box
          sx={{
            mt: 5,
            textAlign: "center",
            borderTop: "1px solid #e0c9a6",
            pt: 3,
          }}
        >
          <Typography variant="body2" sx={{ color: "#f5e6d3" }}>
            © {new Date().getFullYear()} {t("temple.name")}.{" "}
            {t("common.allRightsReserved")}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
