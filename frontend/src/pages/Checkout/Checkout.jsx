import { useLocation, useParams } from "react-router-dom";
import React from "react";

import Navbar from "../../components/Navbar"
import ReservationSummary from "../../components/ReservationSummary";
import PaymentForm from "../../components/forms/PaymentForm";
import Container from "../../components/Container";

import "../../style/Checkout.css"

const Checkout = () => {
    const { type, id } = useParams();
    const { state } = useLocation();

    if (!state) return <h2>Error: No hay datos de reserva</h2>;

    const { startDate, endDate, nights, price, total } = state;

    return (
        <>
            <Navbar/>
            <Container>
                <div className="checkout-container">
                    <div className="checkout-left">
                        <PaymentForm
                            bookingId={id}
                            onSuccess={ () => alert("Pago completado")}
                            date_start={startDate}
                            date_end={endDate}
                            total={total}
                        />
                    </div>
                    <div className="checkout-right">
                        <ReservationSummary
                            startDate={startDate}
                            endDate={endDate}
                            nights={nights}
                            price={price}
                            total={total}
                        />
                    </div>
                </div>
            </Container>
        </>
    );
}
export default Checkout; 