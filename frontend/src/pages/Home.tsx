import { useEffect, useState } from "react";
import axios from "../../helpers/axiosConfig";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

interface Employee {
  id: number;
  name: string;
  email: string;
  salary: number;
  isDiscarded: boolean;
}

function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("Filter employees");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get<Employee[]>("/employees");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const deleteEmployee = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`/employees/${id}`);
        setEmployees(employees.filter((employee) => employee.id !== id));
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function getDeletedEmployees() {
    try {
      const response = await axios.get<Employee[]>("/employees/disc");
      setEmployees(response.data);
      setSelectedFilter("View Inactive Employees");
    } catch (error) {
      console.error("Error fetching deleted employees:", error);
    }
  }

  async function getActiveEmployees() {
    try {
      const response = await axios.get<Employee[]>("/employees");
      setEmployees(response.data);
      setSelectedFilter("View Active Employees");
    } catch (error) {
      console.error("Error fetching active employees:", error);
    }
  }

  async function getEmployees() {
    try {
      const response = await axios.get<Employee[]>("/employees/all");
      setEmployees(response.data);
      setSelectedFilter("View All Employees");
    } catch (error) {
      console.error("Error fetching all employees:", error);
    }
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <b>Employee Management</b>
          </a>
          <div className="collapse navbar-collapse d-flex justify-content-end align-items-center">
            <form className="d-flex me-3">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>


            <Dropdown className="me-2">
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {selectedFilter}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={getActiveEmployees}>
                  View Active Employees
                </Dropdown.Item>
                <Dropdown.Item onClick={getEmployees}>
                  View All Employees
                </Dropdown.Item>
                <Dropdown.Item onClick={getDeletedEmployees}>
                  View Inactive Employees
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>


            <button
              className="btn btn-primary"
              onClick={() => navigate("/add-employee")}
            >
              Add Employee
            </button>
          </div>
        </div>
      </nav>


      <div className="container mt-5">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Sr.no</th>
              <th scope="col">Name</th>
              <th scope="col" className="text-end"></th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee, index) => (
              <tr key={employee.id}>
                <td>{index + 1}</td>
                <td>{employee.name}</td>
                <td className="text-end">
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => navigate(`/view-employee/${employee.id}`)}
                    disabled={employee.isDiscarded}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-success me-2"
                    onClick={() => navigate(`/update-employee/${employee.id}`)}
                    disabled={employee.isDiscarded}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteEmployee(employee.id)}
                    disabled={employee.isDiscarded}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Home;
