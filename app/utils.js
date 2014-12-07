module.exports = {
  generateUID: function() {
    return Math.random().toString(36).substr(2,6);
  },
  calculateDistance: function(lon1, lat1, lon2, lat2){
    dlon = lon2 - lon1;
    dlat = lat2 - lat1;
    a = Math.sin(dlat/2) * Math.sin(dlat/2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);
    c = 2 * Math.atan2( Math.sqrt(a), Math.sqrt(1 - a) );
    d = ( 6371 * c ) * 0.621371;
    return d;
  }
};
