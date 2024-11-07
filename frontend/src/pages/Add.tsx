import { useState } from "react";
import axios from "../../helpers/axiosConfig"; 
import { useNavigate } from "react-router-dom"; 

interface Employee {
  name: string;
  email: string;
  salary: number;
  isDiscarded: boolean;
}

function Add() {
  const [employee, setEmployee] = useState<Employee>({
    name: "",
    email: "",
    salary: 0,
    isDiscarded: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false); 
  const [apiError, setApiError] = useState<string | null>(null); 
  const navigate = useNavigate(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployee({
      ...employee,
      [name] : value,
    });

    
    setErrors({
      ...errors,
      [name]: "",
    });
    setApiError(null); 
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!employee.name) {
      newErrors.name = "Name is required";
    }
    if (!employee.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(employee.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (employee.salary <= 0) {
      newErrors.salary = "Salary must be a positive number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true); 
      try {
        const response = await axios.post<Employee>("/employees", employee);
        console.log("Employee added:", response.data);
        setEmployee({ name: "", email: "", salary: 0, isDiscarded: false });
        setLoading(false); 
        navigate("/"); 
      } catch (error: any) {
        console.error("Error adding employee:", error);
        setLoading(false); 

       
        if (error.response) {
       
          if (error.response.status === 409) {
            setApiError("Email already exists. Please use a different email."); 
          } else {
            setApiError("An error occurred while adding the employee.");
          }
        } else {
          setApiError("Network error. Please try again later."); 
        }
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add Employee</h2>
      {loading && (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      {apiError && <div className="alert alert-danger">{apiError}</div>}{" "}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={employee.name}
            onChange={handleChange}
            required
          />
          {errors.name && <div className="text-danger">{errors.name}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={employee.email}
            onChange={handleChange}
            required
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="salary" className="form-label">
            Salary
          </label>
          <input
            type="number"
            className="form-control"
            id="salary"
            name="salary"
            value={employee.salary}
            onChange={handleChange}
            required
          />
          {errors.salary && <div className="text-danger">{errors.salary}</div>}
        </div>
        <button type="submit" className="btn btn-primary">
          Add Employee
        </button>
      </form>
    </div>
  );
}

export default Add;
