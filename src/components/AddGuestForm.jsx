import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import add_icon from "../assets/add-icon.png";
import toast from "react-hot-toast";
import { AuthContext } from "../context/auth.context";

function AddGuestForm({ loadGuests }) {
  const storedToken = localStorage.getItem("authToken");
  const {user} = useContext(AuthContext)
  const [showGuests, setShowGuests] = useState(false);
  const [tables, setTables] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "Adult",
    email: "",
    phoneNumber: "",
    notes: "",
    attending: "Pending",
    seatingTable: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    storedToken
    if (formData.seatingTable === "-1") {
      formData.seatingTable = null;
    }

    try {
      await axios
        .post(`${import.meta.env.VITE_API_URL}/api/guests`, formData, {
          headers: { Authorization: `Bearer ${storedToken}` }
        })
        .then((response) => {
          updateTable(response.data);
        });
      console.log("Form submitted successfully");
      toast.success("Guest created successfully");
      setShowGuests(false);
      loadGuests();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleButtonClick = () => {
    setShowGuests(true);
  };

  useEffect(() => {
    const getTables = () => {
      storedToken
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/seatingTables`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        })
        .then((response) => {
          setTables(response.data);
        })
        .catch((error) => console.log(error));
    };
    getTables();
  }, []);

  const updateTable = (newGuest) => {
    storedToken
    if (formData.seatingTable != null) {
      const table = tables.find((table) => table._id === formData.seatingTable);
      table.assignedGuests.unshift(newGuest);
      axios
        .put(`${import.meta.env.VITE_API_URL}/api/seatingTables/${table._id}`, table, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then(() => {
          console.log("Table edited successfully");
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div>
      <div>
        <h2>Add new Guest</h2>
      </div>

      <button onClick={handleButtonClick} className="btn">
        <img src={add_icon} alt="Add Icon" className="home"></img>
      </button>
      {showGuests && (
        <form onSubmit={handleSubmit}>
          <label>
            First Name:
            <input
              type="text"
              name="firstName"
              required={true}
              value={formData.firstName}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Last Name:
            <input
              type="text"
              name="lastName"
              required={true}
              value={formData.lastName}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Age:
            <select name="age" required={true} value={formData.age} onChange={handleChange}>
              <option value="Adult">Adult</option>
              <option value="Child">Child</option>
              <option value="Baby">Baby</option>
            </select>
          </label>
          <br />
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Phone Number:
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Notes:
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </label>
          <br />
          <label>
            Attending:
            <select
              name="attending"
              required={true}
              value={formData.attending}
              onChange={handleChange}
            >
              <option value="Attending">Attending</option>
              <option value="Pending">Pending</option>
              <option value="Declined">Declined</option>
            </select>
          </label>
          <label>Table: </label>
          <select
            name="seatingTable"
            value={formData.seatingTable}
            onChange={handleChange}
          >
            <option value="-1">Unassigned table</option>
            {tables.map((table) => (
              <option value={table._id}>{table.tableName}</option>
            ))}
          </select>
          <br />
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}

export default AddGuestForm;
