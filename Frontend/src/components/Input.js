import React from 'react'
import { useField } from 'formik'


function Input({ ...props }) {
    const [field, meta] = useField(props);
    return (
        <div className="form-group mb-2">
            <input
                {...field}
                {...props}
                className={meta.touched && meta.error ? "is-invalid mt-1 form-control" : "mt-1 form-control"}/>
                {
                    meta.touched && meta.error ? (
                        <div className='text-danger'>{meta.error}</div>
                    ) : null
                }
        </div>
    )
}

export default Input;