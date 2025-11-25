// src/components/investments/LandPlots.jsx
import React from 'react';

const LandPlots = ({ land, plots, loading }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'available';
      case 'booked': return 'booked';
      case 'sold': return 'sold';
      default: return 'unknown';
    }
  };

  if (loading) {
    return <div className="loading">Loading plots...</div>;
  }

  return (
    <div className="land-plots">
      <h3>Plots in {land.Description}</h3>
      
      {!plots || plots.length === 0 ? (
        <div className="no-data">No plots available for this land.</div>
      ) : (
        <div className="plots-table">
          <table>
            <thead>
              <tr>
                <th>Plot Code</th>
                <th>Area (acres)</th>
                <th>Status</th>
                <th>Member Price</th>
                <th>Non-Member Price</th>
              </tr>
            </thead>
            <tbody>
              {plots.map((plot, index) => (
                <tr key={index}>
                  <td>{plot['Plot Code.']}</td>
                  <td>{plot.Area}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(plot['Plot Status'])}`}>
                      {plot['Plot Status']}
                    </span>
                  </td>
                  <td>KSh {plot['Member Price']}</td>
                  <td>KSh {plot['Non Member Price']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LandPlots;