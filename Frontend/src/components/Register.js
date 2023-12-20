import React from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from "yup";
import { Formik, Form } from 'formik';
import Input from './Input';
import { register } from '../services/UserService';
import {toast} from 'react-toastify'

function Register() {
  const phoneRegExp = /^\d{10}$/;
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    firstName: Yup.string().required("This is a required field"),
    lastName: Yup.string().required("This is a required field"),
    email: Yup.string("Invalid email format").email().required("This is a required field"),
    password: Yup.string().required("This is a required field"),
    confirmPassword: Yup.string().required("This is a required field"),
    contactNumber: Yup.string()
      .matches(phoneRegExp, "Phone number is not valid")
      .required("This is a required field"),
  });

  const handleSubmit = values => {
    if (values.password !== values.confirmPassword) {
      return
    }
    register(values).then((res) => {
      if(res)toast.success("Registraion successful");
      navigate('/login');
    }, error => {
      toast.error(error.message)
    })
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 card px-3 py-2" style={{ maxWidth: 400 + "px" }}>
          <Formik
            initialValues={{ firstName: "", lastName: "", email: "", password: "", confirmPassword: "", contactNumber: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => { handleSubmit(values)}}
          >
            {({ touched, errors, values }) =>
              <div>
                <div className="row mb-3">
                  <div className="col-lg-12 text-center">
                    <h1 className="mt-1">Register</h1>
                  </div>
                </div>
                <Form>
                  <Input name="firstName" placeholder="Enter First Name" />
                  <Input name="lastName" placeholder="Enter Last Name" />
                  <Input name="email" placeholder="Enter Email" />
                  <Input name="contactNumber" placeholder="Enter Contact Number" />
                  <Input name="password" type="password" placeholder="Enter Password" autoComplete="off"/>
                  <Input name="confirmPassword" type="password" placeholder="Confirm Password" label="Confirm Password" autoComplete="off"/>
                  {touched.confirmPassword && touched.password && values.password !== values.confirmPassword ? (
                    <div className='text-danger m-0'>Password and confirm password don't match</div>
                  ) : null}
                  <button type="submit" className="btn btn-primary mt-4">
                    Submit
                  </button>
                </Form>
              </div>
            }
          </Formik>
        </div>
      </div>
    </div>
  )
}
export default Register;