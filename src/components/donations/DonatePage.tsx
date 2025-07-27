import React, { ChangeEvent, FormEvent, useState } from "react";
import { CSSProperties } from "styled-components";
import DonationForm from "./DonationForm";
import { t } from "../../utils/translationUtils";

interface DonationFormData {
  fullName: string;
  email: string;
  phone: string;
  amount: string;
  purpose: string;
  upiId: string;
}
const predefinedAmounts: number[] = [101, 501, 1001, 2100, 5100];

function DonatePage() {
  const [formData, setFormData] = useState<DonationFormData>({
    fullName: "",
    email: "",
    phone: "",
    amount: "",
    purpose: "Temple Maintenance",
    upiId: "",
  });
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmountClick = (value: number) => {
    setFormData((prev) => ({ ...prev, amount: value.toString() }));
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.upiId.trim()) {
      alert("UPI ID is required");
      return;
    }

    console.log("Donation Details:", formData);
    alert("Thank you for your donation!");
  };
  // Inline Styles

  return (
    <div>
      <DonationHero />
      <div
        style={{
          backgroundColor: "#fff8f0",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "'Comic Neue', cursive",
            fontSize: "2rem",
            fontWeight: "700",
            marginBottom: "10px",
            color: "#1d1d1d",
          }}
        >
          {/* Why Your Support Matters */}
          {`${t("donate.Why Your Support Matters")}`}
        </h2>
        <div
          style={{
            width: "80px",
            height: "3px",
            backgroundColor: "#e05a00",
            margin: "0 auto 20px auto",
          }}
        ></div>
        <p
          style={{
            color: "#444",
            maxWidth: "700px",
            margin: "0 auto 40px auto",
            fontSize: "1rem",
            lineHeight: "1.6",
          }}
        >
          {`${t("donate.Support-Matters-description")}`}
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "30px",
          }}
        >
          {/* Card 1 */}
          <div
            style={{
              backgroundColor: "#fff5ec",
              borderRadius: "16px",
              padding: "30px 20px",
              width: "300px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                backgroundColor: "#ffe6d1",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                margin: "0 auto 15px auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span role="img" aria-label="Temple">
                🏛️
              </span>
            </div>
            <h4
              style={{
                fontFamily: "'Comic Neue', cursive",
                fontWeight: "700",
                marginBottom: "10px",
              }}
            >
              {/* Temple Maintenance */}
              {`${t("donate.Temple Maintenance")}`}
            </h4>
            <p style={{ fontSize: "0.95rem", color: "#444" }}>
              {`${t("donate.Temple-maintaince-desciption")}`}
              {/* Help us preserve and maintain our sacred temple spaces for current
              and future generations. */}
            </p>
          </div>

          {/* Card 2 */}
          <div
            style={{
              backgroundColor: "#fff5ec",
              borderRadius: "16px",
              padding: "30px 20px",
              width: "300px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                backgroundColor: "#ffe6d1",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                margin: "0 auto 15px auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span role="img" aria-label="Ceremony">
                🙏
              </span>
            </div>
            <h4
              style={{
                fontFamily: "'Comic Neue', cursive",
                fontWeight: "700",
                marginBottom: "10px",
              }}
            >
              {/* Religious Ceremonies */}
              {`${t("donate.Religious Ceremonies")}`}
            </h4>
            <p style={{ fontSize: "0.95rem", color: "#444" }}>
              {`${t("donate.Religious-ceremonies-desciption")}`}

              {/* Support our daily pujas, festivals, and special religious
              ceremonies throughout the year. */}
            </p>
          </div>

          {/* Card 3 */}
          <div
            style={{
              backgroundColor: "#fff5ec",
              borderRadius: "16px",
              padding: "30px 20px",
              width: "300px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                backgroundColor: "#ffe6d1",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                margin: "0 auto 15px auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span role="img" aria-label="Community">
                🤝
              </span>
            </div>
            <h4
              style={{
                fontFamily: "'Comic Neue', cursive",
                fontWeight: "700",
                marginBottom: "10px",
              }}
            >
              {/* Community Services */}
              {`${t("donate.Community Services")}`}
            </h4>
            <p style={{ fontSize: "0.95rem", color: "#444" }}>
              {`${t("donate.Community-service-desciption")}`}
              {/* Fund our community outreach programs, education initiatives, and
              charitable activities. */}
            </p>
          </div>
        </div>
      </div>
      <DonationForm />
    </div>
  );
}

function DonationHero() {
  const handleScrollToForm = () => {
    const formElement = document.getElementById("payment-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div
      style={{
        backgroundImage:
          "url('https://img.goodfon.com/wallpaper/nbig/9/bd/indiia-khram-drevnost-peizazh.webp')",
        backgroundSize: "cover",
        backgroundPosition: "top",
        position: "relative",
        padding: "80px 40px",
        color: "#fff",
        textAlign: "left",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          backgroundColor: "rgba(224, 90, 0, 0.50)",
          zIndex: 0,
        }}
      ></div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "600px" }}>
        <h1
          style={{
            fontSize: "2.8rem",
            fontWeight: "600",
            marginBottom: "20px",
            fontFamily: "'Comic Neue', cursive",
          }}
        >
          {/* Support Our Temple */}
          {`${t("donate.support-our-temple")}`}

          <div
            style={{
              width: "60px",
              height: "4px",
              backgroundColor: "#fff",
              marginTop: "6px",
            }}
          ></div>
        </h1>

        <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
          {`${t("donate.support-hero-description")}`}
          {/* Your generous contribution helps us maintain our sacred spaces,
          conduct spiritual ceremonies, and serve the community through various
          initiatives. */}
        </p>

        <button
          onClick={handleScrollToForm}
          style={{
            marginTop: "30px",
            padding: "12px 24px",
            backgroundColor: "#fff",
            color: "#e05a00",
            border: "none",
            borderRadius: "30px",
            fontSize: "1rem",
            fontWeight: "500",
            display: "inline-flex",
            alignItems: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <span style={{ marginRight: "8px" }}>❤️</span>{" "}
          {`${t("donate.Donate Now")}`}
        </button>
      </div>
    </div>
  );
}

export default DonatePage;
