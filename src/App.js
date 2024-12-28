import React, { useState, useEffect } from 'react';

const Navigation = ({ activePage, rowsPerPage, totalRows, onPageChange }) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handleNext = () => {
    if (activePage < totalPages) {
      onPageChange(activePage + 1);
    }
  };

  const handlePrevious = () => {
    if (activePage > 1) {
      onPageChange(activePage - 1);
    }
  };

  return (
    <div>
      <button onClick={handlePrevious} disabled={activePage === 1}>
        Previous
      </button>
      <span style={{ margin: "0 10px" }}>Page {activePage}</span>
      <button onClick={handleNext} disabled={activePage === totalPages}>
        Next
      </button>
    </div>
  );
};

const EmployeeTable = ({ rows }) => {
  return (
    <table style={{ width: "100%", border: "1px solid black", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid black", padding: "8px" }}>ID</th>
          <th style={{ border: "1px solid black", padding: "8px" }}>Name</th>
          <th style={{ border: "1px solid black", padding: "8px" }}>Email</th>
          <th style={{ border: "1px solid black", padding: "8px" }}>Role</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.id}>
            <td style={{ border: "1px solid black", padding: "8px" }}>{row.id}</td>
            <td style={{ border: "1px solid black", padding: "8px" }}>{row.name}</td>
            <td style={{ border: "1px solid black", padding: "8px" }}>{row.email}</td>
            <td style={{ border: "1px solid black", padding: "8px" }}>{row.role}</td>
          </tr>
        ))}
        {rows.length === 0 && (
          <tr>
            <td colSpan="4" style={{ textAlign: "center", padding: "8px" }}>
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

const EmployeeApp = () => {
  const [employees, setEmployees] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setEmployees(result);
      } catch (error) {
        alert("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  // Calculate rows for the current page
  const lastRowIndex = activePage * rowsPerPage;
  const firstRowIndex = lastRowIndex - rowsPerPage;
  const currentRows = employees.slice(firstRowIndex, lastRowIndex);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  return (
    <div>
      <h1>Employee Data</h1>
      <EmployeeTable rows={currentRows} />
      <Navigation
        activePage={activePage}
        rowsPerPage={rowsPerPage}
        totalRows={employees.length}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default EmployeeApp;
