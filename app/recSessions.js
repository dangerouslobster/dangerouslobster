// Collection class to hold RecSession instances
var RecSessions = function(){
  this.sessions = {};
};


// Returns session based on uniqueId
RecSessions.prototype.getSession = function(uid) {
  return this.sessions[uid];
};

// Adds a session to the collection
RecSessions.prototype.addSession = function(session){
  this.sessions[session.uniqueID] = session;
};

module.exports = RecSessions;
