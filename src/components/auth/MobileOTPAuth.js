import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Grid,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Phone as PhoneIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import authService from "../../services/auth";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: "#E2DFD2",
  borderRadius: "15px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    "& fieldset": {
      borderColor: "#d35400",
    },
    "&:hover fieldset": {
      borderColor: "#b34700",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#d35400",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#4a4a4a",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#d35400",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#d35400",
  color: "#E2DFD2",
  padding: theme.spacing(1.5),
  "&:hover": {
    backgroundColor: "#b34700",
  },
  "&.Mui-disabled": {
    backgroundColor: "#e0c9a6",
    color: "#4a4a4a",
  },
}));

const OTPInput = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    fontSize: "1.5rem",
    fontWeight: "bold",
    textAlign: "center",
    width: "40px",
    "& fieldset": {
      borderColor: "#d35400",
    },
    "&:hover fieldset": {
      borderColor: "#b34700",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#d35400",
    },
  },
}));

// Enum for authentication steps
const AuthStep = {
  ENTER_MOBILE: "ENTER_MOBILE",
  VERIFY_OTP: "VERIFY_OTP",
  REGISTRATION: "REGISTRATION",
};

const MobileOTPAuth = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(AuthStep.ENTER_MOBILE);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    username: "",
    address: "",
    city: "",
    state: "",
    country: "India",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    console.log({ error });
  }, [error]);

  const navigate = useNavigate();
  const otpInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Focus OTP input when verification step is active
  useEffect(() => {
    if (currentStep === AuthStep.VERIFY_OTP && otpInputRefs[0].current) {
      setTimeout(() => {
        otpInputRefs[0].current.focus();
      }, 300);
    }
  }, [currentStep]);

  // Handle mobile number change
  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/[^0-9+]/g, "");
    setMobileNumber(value);
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input if current input is filled
      if (value && index < 5) {
        otpInputRefs[index + 1].current.focus();
      }
    }
  };

  // Handle OTP keydown
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Focus previous input on backspace if current input is empty
      otpInputRefs[index - 1].current.focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const numericData = pasteData.replace(/[^0-9]/g, "").substring(0, 6);

    if (numericData.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < numericData.length; i++) {
        newOtp[i] = numericData[i];
      }
      setOtp(newOtp);

      // Focus the next empty input or the last input
      const nextEmptyIndex = numericData.length < 6 ? numericData.length : 5;
      otpInputRefs[nextEmptyIndex].current.focus();
    }
  };

  // Handle user data change for registration
  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate mobile number
  const validateMobileNumber = () => {
    if (!mobileNumber || mobileNumber.replace(/[^0-9]/g, "").length < 10) {
      setError(t("auth.invalidMobile"));
      return false;
    }
    return true;
  };

  // Validate OTP
  const validateOtp = () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError(t("auth.invalidOtp"));
      return false;
    }
    return true;
  };

  // Validate registration data
  const validateRegistrationData = () => {
    if (!userData.name) {
      setError(t("auth.requiredFields"));
      return false;
    }

    if (userData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        setError(t("auth.invalidEmail"));
        return false;
      }
    }

    return true;
  };

  // Start OTP timer
  const startOtpTimer = () => {
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  // Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateMobileNumber()) {
      return;
    }

    setLoading(true);

    try {
      const response = await authService.requestOTP(`91${mobileNumber}`);
      setOtpSent(true);
      setSuccess(t("auth.otpSent", { mobile: mobileNumber }));
      setCurrentStep(AuthStep.VERIFY_OTP);
      startOtpTimer();
    } catch (err) {
      console.error("Error requesting OTP:", err);
      setError(err.response?.data?.message || err.message || t("auth.error"));
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateOtp()) {
      return;
    }

    setLoading(true);

    try {
      const response = await authService.verifyOTP(
        `91${mobileNumber}`,
        otp.join("")
      );

      if (response.requiresRegistration) {
        setCurrentStep(AuthStep.REGISTRATION);
        setSuccess(t("auth.otpVerified"));
      } else {
        setSuccess(t("auth.loginSuccessful"));
        setTimeout(() => {
          if (response?.user?.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/dashboard");
          }
        }, 1000);
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      if (err.response?.data?.requiresRegistration) {
        setCurrentStep(AuthStep.REGISTRATION);
      } else {
        setError(
          err.response?.data?.message || err.message || t("auth.invalidOtp")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Complete registration
  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateRegistrationData()) {
      return;
    }

    setLoading(true);

    try {
      const response = await authService.verifyOTPAndRegister(
        `91${mobileNumber}`,
        otp.join(""),
        userData
      );
      setSuccess(t("auth.registrationSuccessful"));
      setTimeout(() => {
        if (response?.user?.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 1000);
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

  // Render mobile number form
  const renderMobileForm = () => (
    <form onSubmit={handleRequestOtp}>
      <StyledTextField
        fullWidth
        label={t("auth.mobileNumber")}
        value={mobileNumber}
        onChange={handleMobileChange}
        placeholder={t("auth.enterMobileNumber")}
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Typography sx={{ color: "#d35400", fontWeight: 500 }}>
                +91
              </Typography>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("auth.otpMessage")}
      </Typography>

      <StyledButton
        fullWidth
        type="submit"
        disabled={loading}
        startIcon={
          loading ? <CircularProgress size={20} color="inherit" /> : null
        }
      >
        {loading ? t("auth.sendingOtp") : t("auth.sendOtp")}
      </StyledButton>
    </form>
  );

  // Render OTP verification form
  const renderOtpForm = () => (
    <form onSubmit={handleVerifyOtp}>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2 }}>
        {otp.map((digit, index) => (
          <OTPInput
            key={index}
            inputRef={otpInputRefs[index]}
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
            onPaste={handleOtpPaste}
            inputProps={{
              maxLength: 1,
              inputMode: "numeric",
              pattern: "[0-9]*",
              autoComplete: "one-time-code",
            }}
          />
        ))}
      </Box>
      {error && (
        <Typography variant="body2" color="error" align="center" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mb: 2 }}
      >
        {timer > 0
          ? t("auth.otpTimer", { seconds: timer })
          : t("auth.otpExpired")}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          {t("auth.otpSent", { mobile: mobileNumber })}
        </Typography>
        {timer > 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t("auth.resendOtp")} ({timer}s)
          </Typography>
        ) : (
          <Button
            color="primary"
            onClick={handleRequestOtp}
            disabled={loading}
            sx={{ color: "#d35400" }}
          >
            {t("auth.resendOtp")}
          </Button>
        )}
      </Box>

      <StyledButton
        fullWidth
        type="submit"
        disabled={loading || otp.join("").length !== 6}
        startIcon={
          loading ? <CircularProgress size={20} color="inherit" /> : null
        }
      >
        {loading ? t("auth.verifyingOtp") : t("auth.verifyOtp")}
      </StyledButton>

      <Button
        fullWidth
        onClick={() => setCurrentStep(AuthStep.ENTER_MOBILE)}
        disabled={loading}
        startIcon={<ArrowBackIcon />}
        sx={{ mt: 2, color: "#d35400" }}
      >
        {t("auth.changeMobileNumber")}
      </Button>
    </form>
  );

  // Render registration form
  const renderRegistrationForm = () => (
    <form onSubmit={handleCompleteRegistration}>
      <Typography variant="h6" sx={{ color: "#d35400", mb: 3 }}>
        {t("auth.personalInformation")}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <StyledTextField
            fullWidth
            label={t("auth.fullName")}
            name="name"
            value={userData.name}
            onChange={handleUserDataChange}
            placeholder={t("auth.enterFullName")}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <StyledTextField
            fullWidth
            label={t("auth.email")}
            name="email"
            type="email"
            value={userData.email}
            onChange={handleUserDataChange}
            placeholder={t("auth.enterEmailOptional")}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <StyledTextField
            fullWidth
            label={t("auth.preferredUsername")}
            name="username"
            value={userData.username}
            onChange={handleUserDataChange}
            placeholder={t("auth.enterUsernameOptional")}
            helperText={t("auth.usernameAutoGenerated")}
          />
        </Grid>

        <Grid item xs={12}>
          <StyledTextField
            fullWidth
            label={t("auth.address")}
            name="address"
            value={userData.address}
            onChange={handleUserDataChange}
            placeholder={t("auth.enterAddress")}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <StyledTextField
            fullWidth
            label={t("auth.city")}
            name="city"
            value={userData.city}
            onChange={handleUserDataChange}
            placeholder={t("auth.enterCity")}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <StyledTextField
            fullWidth
            label={t("auth.state")}
            name="state"
            value={userData.state}
            onChange={handleUserDataChange}
            placeholder={t("auth.enterState")}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <StyledTextField
            fullWidth
            label={t("auth.country")}
            name="country"
            value={userData.country}
            onChange={handleUserDataChange}
            placeholder={t("auth.enterCountry")}
          />
        </Grid>
      </Grid>

      <StyledButton
        fullWidth
        type="submit"
        disabled={loading}
        startIcon={
          loading ? <CircularProgress size={20} color="inherit" /> : null
        }
        sx={{ mt: 3 }}
      >
        {loading
          ? t("auth.completingRegistration")
          : t("auth.completeRegistration")}
      </StyledButton>
    </form>
  );

  // Render appropriate form based on current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case AuthStep.ENTER_MOBILE:
        return renderMobileForm();
      case AuthStep.VERIFY_OTP:
        return renderOtpForm();
      case AuthStep.REGISTRATION:
        return renderRegistrationForm();
      default:
        return renderMobileForm();
    }
  };

  return (
    <Box sx={{ bgcolor: "#E2DFD2", minHeight: "100vh", py: 8 }}>
      <Container maxWidth="sm">
        <StyledPaper>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{ color: "#d35400", fontWeight: "bold" }}
          >
            {currentStep === AuthStep.REGISTRATION
              ? t("auth.completeRegistration")
              : t("auth.loginWithMobileOtp")}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, bgcolor: "#E2DFD2" }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3, bgcolor: "#E2DFD2" }}>
              {success}
            </Alert>
          )}

          {renderCurrentStep()}
        </StyledPaper>
      </Container>
    </Box>
  );
};

export default MobileOTPAuth;
