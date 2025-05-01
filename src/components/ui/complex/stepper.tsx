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

// Custom Connector with centered line
const CustomConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 24, // Half of your 48px icon height
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#d9d9d9",
    borderTopWidth: 1,
    top: "50%",
    transform: "translateY(-50%)",
  },
}));

// Custom Step Icon (unchanged from your original)
function CustomStepIcon(props: { active?: boolean; icon: React.ReactNode }) {
  const { active, icon } = props;
  return (
    <Box
      sx={{
        zIndex: 1,
        width: 48,
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        border: "1px solid #d9d9d9",
        backgroundColor: active ? "#d5d5d5" : "#FFFFFF",
        color: "#000000",
        fontFamily: "var(--font-poppins)",
        fontSize: {
          sm: "0.5rem",
          md: "1rem",
        },
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
          marginTop: "8px", // Add space between icon and label
          fontFamily: "var(--font-poppins)",
          fontSize: {
            sm: "0.5rem",
            md: "1rem",
          },
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
