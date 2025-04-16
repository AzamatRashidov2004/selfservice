import React from 'react';
import "./Stepper.css"
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import StepperComponent from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Check from '@mui/icons-material/Check';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';

// Define the green color variable
const greenColor = 'rgb(0 198 105)';

// Styled components for custom step connector and step icon
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: greenColor, // Green color for active step connector
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: greenColor, // Green color for completed step connector
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
    ...theme.applyStyles('dark', {
      borderColor: theme.palette.grey[800],
    }),
  },
}));

const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean; completed?: boolean } }>(({ theme, ownerState }) => ({
  color: '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  '& .QontoStepIcon-completedIcon': {
    color: greenColor, // Green color for completed icon
    zIndex: 1,
    fontSize: 18,
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: ownerState.completed ? greenColor : 'currentColor', // Green color for completed step icon circle
  },
  ...theme.applyStyles('dark', {
    color: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        color: greenColor, // Green color for active step icon
      },
    },
  ],
}));

const QontoStepIcon: React.FC<StepIconProps> = (props) => {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active, completed }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
};

// Define steps for the Stepper
const steps = [
  'Upload Document',
  'Project Details',
  'Bot Customization',
];

// Functional component for CustomizedSteppers with activeStep prop
interface CustomizedSteppersProps {
  activeStep: number;
}

const Stepper: React.FC<CustomizedSteppersProps> = ({ activeStep }) => {
  return (
    <Stack sx={{ width: '100%' }} spacing={4}>
      <StepperComponent alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </StepperComponent>
    </Stack>
  );
};

export default Stepper;
