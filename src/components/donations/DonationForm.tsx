import React, { useState } from "react";
import { t } from "../../utils/translationUtils";

const DonationForm: React.FC = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const donationOptions = [101, 501, 1101, 2100, 5100];

  const handleAmountClick = (amt: number) => {
    setSelectedAmount(amt);
    setAmount(amt);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setAmount(isNaN(value) ? "" : value);
    setSelectedAmount(null);
  };

  const handleDonate = () => {
    if (!mobile || !name || !amount) {
      alert("Please fill in all fields and select/enter a donation amount.");
      return;
    }

    const upiLink = `upi://pay?pa=temple@upi&pn=Temple%20Trust&am=${amount}&cu=INR`;
    window.location.href = upiLink;
  };

  return (
    <div
      id="payment-form"
      style={{
        backgroundColor: "#fff8f0",
        textAlign: "center",
      }}
    >
      <div className="container py-5" style={{ maxWidth: "960px" }}>
        <div className="row shadow rounded p-4 bg-white">
          {/* Form Section */}
          <div className="col-md-6">
            <h3
              className="text-center mb-3  fw-bold"
              style={{ color: "#E46B17" }}
            >
              {/* Support Our Temple */}
              {`${t("donate.support-our-temple")}`}
            </h3>
            <p className="text-center text-muted mb-4">
              {`${t("donate.support-hero-description")}`}
              {/* Your generous contributions help us maintain our temple and
              continue our spiritual and community services */}
            </p>

            <form>
              <div className="mb-3">
                {/* <label className="form-label">Name</label> */}
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                {/* <label className="form-label">Phone Number</label> */}
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter your phone number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  {" "}
                  {`${t("donate.Donation Amount")}`}
                  (₹)
                </label>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {donationOptions.map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      className={`btn ${
                        selectedAmount === amt
                          ? "btn-warning text-white"
                          : "btn-outline-warning"
                      }`}
                      onClick={() => handleAmountClick(amt)}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Or enter custom amount"
                  value={amount}
                  onChange={handleCustomAmountChange}
                  min={1}
                />
              </div>

              <div className="alert alert-warning small mt-4">
                <i className="bi bi-info-circle-fill me-2"></i>
                {`${t("donate.upi-note")}`}
                {/* We currently only accept UPI payments. You will be redirected to
                your UPI app. */}
              </div>

              <button
                type="button"
                className="btn btn-warning w-100 mt-3 text-white fw-bold"
                style={{ color: "#E46B17" }}
                onClick={handleDonate}
              >
                {/* Proceed to Donate */}
                {`${t("donate.Proceed to Donate")}`}
              </button>
            </form>
          </div>

          {/* Image + Info Section */}
          <div className="col-md-6 mt-4 mt-md-0 d-flex flex-column align-items-center justify-content-center">
            <img
              src="./DonationTemple.png"
              alt="Temple Donation"
              className="img-fluid rounded mb-3"
            />
            <div
              className="p-3 rounded text-start "
              style={{
                backgroundColor: "#FFF4EE", // Light peach background
                borderRadius: "10px",
              }}
            >
              <h6 className="fw-bold mb-3" style={{ color: "#E46B17" }}>
                {/* Why Donate? */}
                {`${t("donate.Why Donate")}`}
              </h6>
              <ul className="mb-0 ps-3 small" style={{ color: "#333" }}>
                <li className="mb-2">
                  <span style={{ color: "#E46B17", marginRight: "8px" }}>
                    🕉
                  </span>
                  {`${t("donate.support-maintaince-message")}`}
                  {/* Support temple maintenance and daily rituals */}
                </li>
                <li className="mb-2">
                  <span style={{ color: "#E46B17", marginRight: "8px" }}>
                    🙏
                  </span>
                  {`${t("donate.charitable-activities")}`}
                  {/* Contribute to community services and charitable activities */}
                </li>
                <li className="mb-2">
                  <span style={{ color: "#E46B17", marginRight: "8px" }}>
                    🌱
                  </span>
                  {`${t("donate.spiritual traditions")}`}
                  {/* Help preserve and promote spiritual traditions */}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;
