import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

// API endpoint
const API_URL = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';

const ITEMS_PER_PAGE = 10;

const PaginatedTable = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null); // Clear previous errors

      try {
        const response = await axios.get(API_URL);
        const allData = response.data;

        // Calculate total pages
        const totalItems = allData.length;
        setTotalPages(Math.ceil(totalItems / ITEMS_PER_PAGE));

        // Slice the data for the current page
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setData(allData.slice(startIndex, endIndex));
      } catch (err) {
        setError(err);
        alert("failed to fetch data"); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  // Change page
  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle Previous and Next buttons
  const handlePrevious = () => goToPage(currentPage - 1);
  const handleNext = () => goToPage(currentPage + 1);

  return (
    <div className="paginated-table">
      <h1 className="table-heading" >Employee Data Table</h1>

      {loading && <p>Loading...</p>}
      {error && <p>Error loading data: {error.message}</p>}

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
           
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.role}</td>
               
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No data available</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button onClick={handlePrevious} disabled={currentPage === 1} className="pagination-button">
          Previous
        </button>

        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page + 1}
            onClick={() => goToPage(page + 1)}
            className={`pagination-button ${currentPage === page + 1 ? 'active' : ''}`}
          >
            {page + 1}
          </button>
        ))}

        <button onClick={handleNext} disabled={currentPage === totalPages} className="pagination-button">
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginatedTable;