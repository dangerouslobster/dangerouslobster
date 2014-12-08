module.exports = {
  // Utility function for generation unique IDs
  generateUID: function() {
    return Math.random().toString(36).substr(2,6);
  }
};
