import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const newTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price
    },
    onSuccess: () => {
      console.log('Ticket created successfully', { title, price });
      Router.push('/');
    }
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  }

  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  }
  
  return (
    <div>
      <h1>Create a New Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
           type="text"
           name="title"
           value={title}
           onChange={e => setTitle(e.target.value)} 
           className="form-control"
            />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input 
           type="number"
           onBlur={onBlur}
           value={price} 
           onChange={e => setPrice(e.target.value)} 
           className="form-control" 
           />
        </div>
        {errors}
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default newTicket;