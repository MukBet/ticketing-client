import useRequest from "../../hooks/use-request";
import Router from "next/router";

const TicketShow = ({ ticket, currentUser }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
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
      {/* to not pass the event object to doRequest, we wrap it in an arrow function */}
      <button onClick={() => doRequest()} className="btn btn-primary">Purchase</button>
{/*       Думаю в идеале тут нужно добавить возмоджность вернутся на страницу оплаты, если заказ уже был создан, но не был оплачен. 
Иначе пользователь может случайно закрыть страницу и потерять заказ. 
Но побыстрому не смог. Думаю должно быть так: проверить что для текущего текета уже есть заказ, и если он есть и текущий пользователь является его создателем, то показать кнопку "View order", которая будет вести на страницу оплаты.
*/}
      {/* {currentUser.id == ticket.userId && order && order.status === 'Created' && (
        <button onClick={() => Router.push('/orders')} className="btn btn-primary">View order</button>
      )} */}
      {errors}
    </div>
  );
}

TicketShow.getInitialProps = async (context, client, currentUser) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data, currentUser };
}

export default TicketShow;