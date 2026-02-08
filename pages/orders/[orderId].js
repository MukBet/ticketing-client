import useRequest from "../../hooks/use-request";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import  Router from "next/router";

// https://dashboard.stripe.com/acct_..../test/settings/integration включил "Enable card data collection with a publishable key without using Stripe's pre-built UI elements"
// чисто для моей локалки.
const OrderShow = ({ order, currentUser }) => {
  console.log('!!!!order=', order);
  const [timeLeft, setTimeLeft] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => {
      console.log('Payment Successful')

      Router.push('/orders');
    }
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    setInterval(findTimeLeft, 1000);

    return () => { clearInterval(findTimeLeft); };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return ( // https://chatgpt.com/share/698430a6-bf14-8005-9fd7-78d29f578a24 
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => {
          console.log('id=', id);
          doRequest({ token: id });
        }}
        stripeKey="pk_test_51SvNgvRREArcDv6tn0ZScnhcMfIKuEcW7HgnN78xJZabyQP8OkhL9uAEXaeg3gNu22ZjhwqyyVI3avwNhE3xKfVg00UVb9G2o4" // Replace with your actual public key
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  console.log('!!!!data=', data);
  return { order: data };
}

export default OrderShow;