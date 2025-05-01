import * as React from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Box from "@mui/material/Box";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";

const steps = [
  { title: "Important!" },
  { title: "Date contact & media" },
  { title: "Locație" },
  { title: "Chatbot" },
];

// Custom Connector with centered line, responsive to icon size
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    // Responsive: half the icon height at each breakpoint
    [theme.breakpoints.down("sm")]: {
      top: 12,
      left: "calc(-50% + 12px)",
      right: "calc(50% + 12px)",
    }, // 24px icon → 12px
    [theme.breakpoints.up("sm")]: {
      top: 24,
      left: "calc(-50% + 24px)",
      right: "calc(50% + 24px)",
    }, // 48px icon → 24px
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#d9d9d9",
    borderTopWidth: 1,
    top: "50%",
    transform: "translateY(-50%)",
  },
}));

function CustomStepIcon(props: { active?: boolean; icon: React.ReactNode }) {
  const { active, icon } = props;
  return (
    <Box
      sx={{
        zIndex: 1,
        // Responsive icon size
        width: { xs: 24, sm: 48 },
        height: { xs: 24, sm: 48 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        border: "1px solid #d9d9d9",
        backgroundColor: active ? "#d5d5d5" : "#FFFFFF",
        color: "#000000",
        fontFamily: "var(--font-poppins)",
        fontSize: { xs: "0.5rem", sm: "1rem" }, // Responsive font size for icon number
        transition: "all 0.2s",
      }}
    >
      {icon}
    </Box>
  );
}

export function MaterialStepper({ currentStep }: { currentStep: number }) {
  return (
    <Stepper
      activeStep={currentStep}
      alternativeLabel
      connector={<CustomConnector />}
      sx={{
        "& .MuiStepLabel-label": {
          color: "#000000",
          marginTop: { xs: "4px", sm: "8px" },
          fontFamily: "var(--font-poppins)",
          fontSize: { xs: "0.75rem", sm: "1rem" }, // Responsive label size
          fontWeight: 600,
          lineHeight: 1.4,
          letterSpacing: "0",
        },
      }}
    >
      {steps.map((step) => (
        <Step key={step.title}>
          <StepLabel slots={{ stepIcon: CustomStepIcon }}>
            {step.title}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
