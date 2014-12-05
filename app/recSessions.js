/*
Creates a new collection to hold RecSession models.
@class
*/
var RecSessions = function(){
  this.sessions = {};
};


/*
Getter for session model.
@method getSession

@param{string} Unique RecSession id.

@returns {recSession} RecSession instance
*/
RecSessions.prototype.getSession = function(uid) {
  return this.sessions[uid];
};

/*
Adds session model to collection.
@method addSession

@param{recSession} RecSession instance to add to collection
*/
RecSessions.prototype.addSession = function(session){
  this.sessions[session.uniqueID] = session;
};

module.exports = RecSessions;
