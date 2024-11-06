// Import dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.db", // SQLite database file
});

// Define the Employee model
const Employee = sequelize.define("Employee", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  salary: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  isDiscarded: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

// Sync the database without forcing table recreation
sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully!");
  })
  .catch((err) => console.error("Error syncing database:", err));

// CRUD Routes for Employee

// Create a new employee
app.post("/employees", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if an employee with the same email already exists
    const existingEmployee = await Employee.findOne({ where: { email } });
    if (existingEmployee) {
      return res.status(409).json({ error: "Email already exists." }); // 409 Conflict
    }

    // Create the new employee if the email does not exist
    const employee = await Employee.create(req.body);
    res.status(201).json(employee); // Return created employee data
  } catch (error) {
    res.status(400).json({ error: error.message }); // Handle other errors
  }
});

// Get all active employees
app.get("/employees", async (_req, res) => {
  try {
    const employees = await Employee.findAll({
      where: {
        isDiscarded: 0,
      },
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all employees
app.get("/employees/all", async (_req, res) => {
  try {
    const employees = await Employee.findAll({
      // where: {
      //   isDiscarded: 0,
      // },
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get all employees that are deleted
app.get("/employees/disc", async (_req, res) => {
  try {
    const employees = await Employee.findAll({
      where: {
        isDiscarded: 1,
      },
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get an employee by ID
app.get("/employees/:id", async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an employee by ID
app.put("/employees/:id", async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (employee) {
      await employee.update(req.body);
      res.json(employee);
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an employee by ID
app.delete("/employees/:id", async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (employee) {
      employee.update({ ["isDiscarded"]: true });
      // employee.set("isDiscarded", true);
      // await employee.save();
      // await employee.destroy();
      res.json({ message: "Employee deleted" });
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
