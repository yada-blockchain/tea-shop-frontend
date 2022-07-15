const mapTea = (allTea) => {
  return allTea.map((tea) => {
    return {
      address: tea.giver,
      timestamp: new Date(tea.timestamp * 1000),
      message: tea.message,
      name: tea.name,
    };
  });
};

module.exports = { mapTea };
