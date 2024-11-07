import { useEffect, useState } from "react";
import axios from "../../helpers/axiosConfig"; 
import { useNavigate, useParams } from "react-router-dom"; 

interface Employee {
  id: number;
  name: string;
  email: string;
  salary: number;
}

function Update() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); 

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get<Employee>(`/employees/${id}`); 
        setEmployee(response.data);
      } catch (error) {
        console.error("Error fetching employee:", error);
        setApiError("Error fetching employee details."); 
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (employee) {
      setEmployee({
        ...employee,
        [name] : value,
      });


      setErrors({
        ...errors,
        [name]: "",
      });
      setApiError(null); 
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!employee?.name) {
      newErrors.name = "Name is required";
    }
    if (!employee?.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(employee.email)) {
      newErrors.email = "Email address is invalid";
    }
    if ((employee?.salary ?? 0) <= 0) {
      newErrors.salary = "Salary must be a positive number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (employee && validate()) {
      setLoading(true); 
      try {
        const response = await axios.put<Employee>(
          `/employees/${id}`,
          employee
        ); 
        console.log("Employee updated:", response.data);
        setLoading(false); 
        navigate("/"); 
      } catch (error: any) {
        console.error("Error updating employee:", error);
        setLoading(false);

        
        if (error.response) {
          if (error.response.status === 409) {
            setApiError("Email already exists. Please use a different email."); 
          } else {
            setApiError("An error occurred while updating the employee."); 
          }
        } else {
          setApiError("Network error. Please try again later."); 
        }
      }
    }
  };

  if (!employee) return <div>Loading...</div>; 
  return (
    <div className="container mt-5">
      <h2>Update Employee</h2>
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
          Update Employee
        </button>
      </form>
    </div>
  );
}

export default Update;
