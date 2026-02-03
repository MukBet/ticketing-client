import useRequest from "../../hooks/use-request";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import  Router from "next/router";

const OrderShow = ({ order, currentUser }) => {
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

  return (
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
  return { ticket: data };
}

export default OrderShow;