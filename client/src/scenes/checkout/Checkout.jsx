import { useSelector } from "react-redux";
import { Box, Button, Stepper, Step, StepLabel } from "@mui/material";
import { Formik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import { shades } from "../../theme";
import Shipping from "./Shipping";
import Payment from "./Payment";

// import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const cart = useSelector((state) => state.cart.cart);
  const isFirstStep = activeStep === 0;
  const isSecondStep = activeStep === 1;

  const handleFormSubmit = async (values, actions) => {
    setActiveStep(activeStep + 1);

    //copies the billing address onto shipping address:
    if (isFirstStep && values.shippingAddress.isSameAddress) {
      actions.setFieldValue("shippingAddress", {
        ...values.billingAddress,
        isSameAddress: true,
      });
    }
    if (isSecondStep) {
      makePayment(values);
    }
    actions.setTouched({});
  };

  const initialValues = {
    billingAddress: {
      firstName: "",
      lastName: "",
      country: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      zipCode: "",
    },
    shippingAddress: {
      isSameAddress: true,
      firstName: "",
      lastName: "",
      country: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      zipCode: "",
    },
    email: "",
    phoneNumber: "",
  };

  const checkoutSchema = [
    yup.object().shape({
      billingAddress: yup.object().shape({
        firstName: yup.string().required("required"),
        lastName: yup.string().required("required"),
        country: yup.string().required("required"),
        street1: yup.string().required("required"),
        street2: yup.string(),
        city: yup.string().required("required"),
        state: yup.string().required("required"),
        zipCode: yup.string().required("required"),
      }),
      shippingAddress: yup.object().shape({
        isSameAddress: yup.boolean(),

        firstName: yup.string().when("isSameAddress", {
          is: false,
          then: yup.string().required("required"),
        }),
        lastName: yup.string().when("isSameAddress", {
          is: false,
          then: yup.string().required("required"),
        }),
        country: yup.string().when("isSameAddress", {
          is: false,
          then: yup.string().required("required"),
        }),
        street1: yup.string().when("isSameAddress", {
          is: false,
          then: yup.string().required("required"),
        }),
        street2: yup.string(),
        city: yup.string().when("isSameAddress", {
          is: false,
          then: yup.string().required("required"),
        }),
        state: yup.string().when("isSameAddress", {
          is: false,
          then: yup.string().required("required"),
        }),
        zipCode: yup.string().when("isSameAddress", {
          is: false,
          then: yup.string().required("required"),
        }),
      }),
    }),
    yup.object().shape({
      email: yup.string().required("required"),
      phoneNumber: yup.string().required("required"),
    }),
  ];
  // initMercadoPago("YOUR_PUBLIC_KEY");
  return (
    <Box width="80%" m="100px auto">
      <Stepper activeStep={activeStep} sx={{ m: "20px 0" }}>
        <Step>
          <StepLabel>Billing</StepLabel>
        </Step>
        <Step>
          <StepLabel>Payment</StepLabel>
        </Step>
      </Stepper>
      <Box>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={checkoutSchema[activeStep]}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            validateForm,
            setTouched,
          }) => (
            <form onSubmit={handleSubmit}>
              {isFirstStep && (
                <Shipping
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  setFieldValue={setFieldValue}
                />
              )}
              {isSecondStep && (
                <Payment
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  setFieldValue={setFieldValue}
                />
              )}
              <Box display="flex" justifyContent="space-between" gap="50px">
                {!isFirstStep && (
                  <Button
                    fullWidth
                    color="primary"
                    variant="contained"
                    sx={{
                      backgroundColor: shades.primary[400],
                      boxShadow: "none",
                      color: "white",
                      borderRadius: 0,
                      padding: "15px 40px",
                    }}
                    onClick={() => {
                      console.log("Current Step before decrement:", activeStep);
                      setActiveStep(activeStep - 1);
                    }}
                  >
                    Back
                  </Button>
                )}
                <Button
                  fullWidth
                  color="primary"
                  variant="contained"
                  sx={{
                    backgroundColor: shades.primary[400],
                    boxShadow: "none",
                    color: "white",
                    borderRadius: 0,
                    padding: "15px 40px",
                  }}
                  onClick={async () => {
                    const errors = await validateForm();
                    if (Object.keys(errors).length === 0) {
                      setActiveStep(activeStep + 1);
                    } else {
                      setTouched(errors);
                    }
                    console.log(activeStep);
                  }}
                >
                  {!isSecondStep ? "Next" : "Place Order"}
                </Button>
                {/* <Wallet
                  initialization={{ preferenceId: "<PREFERENCE_ID>" }}
                  customization={{ texts: { valueProp: "smart_option" } }}
                /> */}
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default Checkout;
