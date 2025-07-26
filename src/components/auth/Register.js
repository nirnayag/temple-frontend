import React, { useState } from "react";
import {
  Form,
  Button,
  Card,
  Alert,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import authService from "../../services/auth";

const Register = () => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "USA",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    // Basic validation
    if (
      !userData.username ||
      !userData.email ||
      !userData.password ||
      !userData.name
    ) {
      setError(t("auth.requiredFields"));
      return false;
    }

    if (userData.password !== userData.confirmPassword) {
      setError(t("auth.passwordsDoNotMatch"));
      return false;
    }

    if (userData.password.length < 6) {
      setError(t("auth.passwordLength"));
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      setError(t("auth.invalidEmail"));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = userData;

      await authService.register(registrationData);
      setSuccess(t("auth.registrationSuccessful"));

      // Redirect after short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          t("auth.registrationFailed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="mt-4 mb-4 shadow-sm">
            <Card.Header className="bg-temple text-white">
              <h3 className="mb-0">{t("auth.createAccount")}</h3>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={12}>
                    <h5 className="mb-3">{t("auth.accountInformation")}</h5>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="username">
                      <Form.Label>
                        {t("auth.username")}{" "}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={userData.username}
                        onChange={handleChange}
                        placeholder={t("auth.enterUsername")}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>
                        {t("auth.email")} <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        placeholder={t("auth.enterEmail")}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="password">
                      <Form.Label>
                        {t("auth.password")}{" "}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        placeholder={t("auth.enterPassword")}
                        required
                      />
                      <Form.Text className="text-muted">
                        {t("auth.passwordLength")}
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="confirmPassword">
                      <Form.Label>
                        {t("auth.confirmPassword")}{" "}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={userData.confirmPassword}
                        onChange={handleChange}
                        placeholder={t("auth.enterConfirmPassword")}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md={12}>
                    <h5 className="mb-3">{t("auth.personalInformation")}</h5>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="mb-3" controlId="name">
                      <Form.Label>
                        {t("auth.fullName")}{" "}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        placeholder={t("auth.enterFullName")}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="phone">
                      <Form.Label>{t("auth.phone")}</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={userData.phone}
                        onChange={handleChange}
                        placeholder={t("auth.enterPhone")}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="address">
                      <Form.Label>{t("auth.address")}</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={userData.address}
                        onChange={handleChange}
                        placeholder={t("auth.enterAddress")}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="city">
                      <Form.Label>{t("auth.city")}</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={userData.city}
                        onChange={handleChange}
                        placeholder={t("auth.enterCity")}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="state">
                      <Form.Label>{t("auth.state")}</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={userData.state}
                        onChange={handleChange}
                        placeholder={t("auth.enterState")}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="country">
                      <Form.Label>{t("auth.country")}</Form.Label>
                      <Form.Control
                        type="text"
                        name="country"
                        value={userData.country}
                        onChange={handleChange}
                        placeholder={t("auth.enterCountry")}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col md={12}>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={loading}
                      className="w-100 py-2"
                    >
                      {loading
                        ? t("auth.creatingAccount")
                        : t("auth.createAccount")}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
            <Card.Footer className="text-center">
              <p className="mb-0">
                {t("auth.alreadyHaveAccount")}{" "}
                <Link to="/login">{t("auth.login")}</Link>
              </p>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
