import { useEffect, useState } from "react";
import axios from '../../helpers/axiosConfig'; 
import { useParams } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';

interface Employee {
  id: number;
  name: string;
  email: string;
  salary: number;
}

function View() {
  const { id } = useParams<{ id: string }>(); 
  const [employee, setEmployee] = useState<Employee | null>(null); 
  const [loading, setLoading] = useState<boolean>(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get<Employee>(`/employees/${id}`); 
        setEmployee(response.data); 
      } catch (error) {
        console.error('Error fetching employee:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) {
    return <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>;
  }

  if (!employee) {
    return <div>No employee found.</div>; 
  }

return (
  <div className="container mt-4  justify-content-center align-items-center min-vh-70">
    <div className="row">
      <div className="col-md-6">
        <h3 className="text-center mb-4">Employee Details</h3>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <td>{employee.name}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{employee.email}</td>
            </tr>
            <tr>
              <th>Salary</th>
              <td>{employee.salary}</td>
            </tr>
            <tr>
              <td colSpan={2} className="text-center">
                <button
                  className="btn btn-primary me-2"
                  onClick={() => navigate(`/update-employee/${employee.id}`)}
                >
                  Update
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/`)}
                >
                  Back
                </button>
              </td>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  </div>
);
}

export default View;
