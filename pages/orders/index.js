import Link from 'next/link';

const OrderIndex = ({ orders }) => {
  return (
    <ul className="list-group">
      {orders.map(order => {
        console.log('!@!@!order=', order);
        return (
          <li key={order.id} className="list-group-item">
            <Link href="/tickets/[ticketId]" as={`/tickets/${order.ticket.id}`}>
              {order.ticket.title}
            </Link> - {order.status}
          </li>
        );
      })}
    </ul>
  );
}

OrderIndex.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/orders');
  console.log('!!@!!data=', data);
  return { orders: data };
}

export default OrderIndex;