import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import * as Yup from "yup";
import { Formik, Form } from 'formik';
import { useDispatch } from 'react-redux';
import { authActions } from '../store/auth-slice';
import Input from './Input'
import { login } from '../services/UserService';
import { userActions } from '../store/user-slice';
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

function SignIn({ loggedIn }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (loggedIn) navigate('/dashboard');
  }, []);

  const handleSubmit = (creds) => {
    dispatch(showLoading());
    setIsLoading(true);
    login(creds).then((res) => {
      dispatch(authActions.login(res.token));
      dispatch(userActions.setUser(res.result));
      dispatch(authActions.addToken(res.token))
      dispatch(hideLoading());
      navigate('/dashboard');
      setIsLoading(false);
    }, error => {
      setIsLoading(false);
      dispatch(hideLoading());
      toast.error(error.message);
      console.log("Login error", error);
    });
  }

  const validationSchema = Yup.object({
    username: Yup.string().email().required("This is a required field"),
    password: Yup.string().required("This is a required field"),
  });

  return (
    <div style={{marginTop:"20" + "vh"}}>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 card px-3 py-2" style={{ maxWidth: 400 + "px" }}>
            <Formik
              initialValues={{ username: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={(values) => { handleSubmit(values) }}>
              {({ touched, errors, values }) =>
                <div>
                  <div className="row mb-3">
                    <div className="col-lg-12">
                      <h1 className="mt-1 text-center">Login</h1>
                    </div>
                  </div>
                  <Form>
                    <Input name="username" placeholder="Enter email" type="email" />
                    <Input name="password" placeholder="Enter Password" type="password" autoComplete="on" />
                    {
                      isLoading ?
                        <Button variant="primary" disabled className='mt-4'>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        </Button> :
                        <button type="submit" className="btn btn-primary mt-4">
                          Submit
                        </button>
                    }

                  </Form>
                </div>
              }
            </Formik>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn;