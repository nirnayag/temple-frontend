import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { t } from "../../utils/translationUtils";

const AboutTemple = () => {
  const { i18n } = useTranslation();

  return (
    <Container className="my-5">
      <h1 className="section-heading mb-4">{t("about.aboutTemple")}</h1>

      {/* Introduction Section */}
      <Row className="mb-5">
        <Col lg={7}>
          <p className="lead">{t("about.introduction")}</p>
          <p>{t("about.history")}</p>
          <p>{t("about.mission")}</p>
        </Col>
        <Col lg={5}>
          <img
            src="https://t4.ftcdn.net/jpg/12/55/70/67/360_F_1255706772_VN5ObaaNkgoTLgtAIqiBmpZFTLC45EO8.jpg"
            alt={t("about.templeBuilding")}
            className="img-fluid rounded shadow-sm"
          />
        </Col>
      </Row>

      {/* Temple Values Section */}
      <div className="mb-5">
        <h2 className="h3 mb-4">{t("about.coreValues")}</h2>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="text-temple mb-3">
                  <i className="fas fa-om fa-3x"></i>
                </div>
                <h3 className="h4">{t("about.spirituality")}</h3>
                <p>{t("about.spiritualityDesc")}</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="text-temple mb-3">
                  <i className="fas fa-hands-helping fa-3x"></i>
                </div>
                <h3 className="h4">{t("about.communityService")}</h3>
                <p>{t("about.communityServiceDesc")}</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="text-temple mb-3">
                  <i className="fas fa-book fa-3x"></i>
                </div>
                <h3 className="h4">{t("about.education")}</h3>
                <p>{t("about.educationDesc")}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Temple Facilities Section */}
      <div className="mb-5">
        <h2 className="h3 mb-4">{t("about.facilities")}</h2>
        <Row>
          <Col md={6}>
            <div className="mb-4">
              <h3 className="h5 text-temple">{t("about.mainSanctum")}</h3>
              <p>{t("about.mainSanctumDesc")}</p>
            </div>
            <div className="mb-4">
              <h3 className="h5 text-temple">{t("about.multiPurposeHall")}</h3>
              <p>{t("about.multiPurposeHallDesc")}</p>
            </div>
          </Col>
          <Col md={6}>
            <div className="mb-4">
              <h3 className="h5 text-temple">{t("about.culturalCenter")}</h3>
              <p>{t("about.culturalCenterDesc")}</p>
            </div>
            <div className="mb-4">
              <h3 className="h5 text-temple">{t("about.diningArea")}</h3>
              <p>{t("about.diningAreaDesc")}</p>
            </div>
          </Col>
        </Row>
      </div>

      {/* Temple History Timeline */}
      <div className="mb-5">
        <h2 className="h3 mb-4">{t("about.history")}</h2>
        <div className="position-relative">
          <div className="timeline-line"></div>
          <Row className="timeline-item mb-4">
            <Col md={2} className="text-center">
              <div className="timeline-circle">2010</div>
            </Col>
            <Col md={10}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h3 className="h5">{t("about.foundation")}</h3>
                  <p>{t("about.foundationDesc")}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="timeline-item mb-4">
            <Col md={2} className="text-center">
              <div className="timeline-circle">2012</div>
            </Col>
            <Col md={10}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h3 className="h5">{t("about.construction")}</h3>
                  <p>{t("about.constructionDesc")}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="timeline-item mb-4">
            <Col md={2} className="text-center">
              <div className="timeline-circle">2015</div>
            </Col>
            <Col md={10}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h3 className="h5">{t("about.inauguration")}</h3>
                  <p>{t("about.inaugurationDesc")}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="timeline-item">
            <Col md={2} className="text-center">
              <div className="timeline-circle">2020</div>
            </Col>
            <Col md={10}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h3 className="h5">{t("about.expansion")}</h3>
                  <p>{t("about.expansionDesc")}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Temple Administration */}
      <div className="mb-5">
        <h2 className="h3 mb-4">{t("about.administration")}</h2>
        <p>{t("about.administrationDesc")}</p>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <h3 className="h5 text-temple">{t("about.boardOfTrustees")}</h3>
                <p>{t("about.boardOfTrusteesDesc")}</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <h3 className="h5 text-temple">
                  {t("about.templeManagement")}
                </h3>
                <p>{t("about.templeManagementDesc")}</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <h3 className="h5 text-temple">{t("about.volunteerGroups")}</h3>
                <p>{t("about.volunteerGroupsDesc")}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Visit Information */}
      <div className="p-4 bg-light rounded">
        <h2 className="h3 mb-4">{t("about.visit")}</h2>
        <Row>
          <Col md={6}>
            <h4>{t("about.templeHours")}</h4>
            <ul className="list-unstyled">
              <li>
                <strong>{t("about.weekdays")}:</strong>{" "}
                {t("about.weekdayHours")}
              </li>
              <li>
                <strong>{t("about.weekends")}:</strong>{" "}
                {t("about.weekendHours")}
              </li>
              <li>
                <strong>{t("about.festivalDays")}:</strong>{" "}
                {t("about.festivalHours")}
              </li>
            </ul>
          </Col>
          <Col md={6}>
            <h4>{t("about.location")}</h4>
            <p>{t("temple.address")}</p>
            <p>{t("temple.phone")}</p>
            <p>{t("temple.email")}</p>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default AboutTemple;
