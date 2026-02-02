import useRequest from "../../hooks/use-request";
import Router from "next/router";

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    data: {
      ticketId: ticket.id
    },
    onSuccess: (order) => {
      console.log('Order created:', order);
      Router.push('/orders/[orderId]', `/orders/${order.id}`);
    }
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: ${ticket.price}</h4>
      <button onClick={doRequest} className="btn btn-primary">Purchase</button>
      {errors}
    </div>
  );
}

TicketShow.getInitialProps = async (context, client, currentUser) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
}

export default TicketShow;