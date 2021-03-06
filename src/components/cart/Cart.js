import { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import CartCategories from "./CartCategories";
import CartSummary from "./CartSummary";
import { Wrapper } from "./Cart.styled";
import { useCartDispatch, useCartState } from "../../controllers/CartContext";
import { CartStepper } from "./CartStepper";
import EmptyCartList from "./EmptyCartList";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import CartItem from "./CartItem";
import Fab from "@mui/material/Fab";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CartAddressForm from "../forms/CartAddressForm";
import CartCheckout from "./CartCheckout";
import CartSetOrder from "./CartSetOrder";

const Cart = () => {
  const { cartItems } = useCartState();
  const { clearCart } = useCartDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [address, setAddress] = useState({
    fname: "",
    surname: "",
    street: "",
    city: "",
    postcode: "",
    phoneNumber: "",
  });
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const handleClearCart = () => {
    clearCart();
  };

  useEffect(() => {
    if (activeStep === 3) {
      const timeout = setTimeout(() => {
        setShouldRedirect(true);
        clearCart();
        return clearTimeout(timeout);
      }, 3000);
    } else {
      setShouldRedirect(false);
    }
  }, [activeStep, clearCart]);

  if (shouldRedirect) {
    return <Redirect to="/" />;
  }

  return (
    <Wrapper
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <CartStepper activeStep={activeStep} />
      {activeStep === 0 && cartItems.length > 0 && (
        <>
          <CartCategories />
          <Divider />
          {cartItems.map((item) => {
            return <CartItem key={item.id} {...item} />;
          })}
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "3rem",
            }}
          >
            <Link to="/" style={{ textDecoration: "none" }}>
              <Fab
                variant="extended"
                color="primary"
                aria-label="continue shopping"
                sx={{
                  fontSize: ".8rem",
                }}
              >
                <AddShoppingCartIcon
                  sx={{
                    fontSize: "1rem",
                    mr: 1,
                  }}
                />
                continue shopping
              </Fab>
            </Link>
            <Fab
              onClick={handleClearCart}
              variant="extended"
              aria-label="clear cart"
              sx={{
                fontSize: ".8rem",
              }}
            >
              <DeleteOutlineIcon
                sx={{
                  fontSize: "1rem",
                  mr: 1,
                }}
              />
              clear shopping cart
            </Fab>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <CartSummary setActiveStep={setActiveStep} />
          </Box>
        </>
      )}
      {cartItems.length <= 0 && <EmptyCartList />}
      {activeStep === 1 && (
        <CartAddressForm
          setActiveStep={setActiveStep}
          address={address}
          setAddress={setAddress}
        />
      )}
      {activeStep === 2 && (
        <CartCheckout {...address} setActiveStep={setActiveStep} />
      )}
      {activeStep === 3 && <CartSetOrder />}
    </Wrapper>
  );
};

export default Cart;
