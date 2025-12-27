import  { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {doRequest, errors} = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: { email, password },
    onSuccess: () => Router.push('/')
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    
    await doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Signup form</h1>
      <div className="form-group">
        <label>Email address</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="form-control"
          placeholder="Enter email"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="form-control"
          placeholder="Password"
        />
      </div>
      {errors}
      <button type="submit" className="btn btn-primary">
        Sign Up
      </button>
    </form>
  );
}