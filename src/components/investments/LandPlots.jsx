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

  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) || numPrice === 0 ? 'TBD' : `KSh ${numPrice.toLocaleString()}`;
  };

  if (loading) {
    return <div className="loading">Loading plots...</div>;
  }

  return (
    <div className="land-plots">
      <h3>Plots in {land?.Description || land?.land_code || 'this land'}</h3>
      
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
                <tr key={`${plot.plot_code}-${index}`}>
                  <td>{plot.plot_code}</td>
                  <td>{plot.area}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(plot.plot_status)}`}>
                      {plot.plot_status}
                    </span>
                  </td>
                  <td>{formatPrice(plot.member_price)}</td>
                  <td>{formatPrice(plot.non_member_price)}</td>
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