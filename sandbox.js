var neo4j = require('node-neo4j');
db = new neo4j('http://localhost:7474');

// Get the hashtags out

var FlowdockText = require('flowdock-text');

var context = "Default";

var statement = "So like #ClignancourtMarket is the #besthing I know and definitely they have lots of cool stuff like #rings and #hoodies much better than #KTZ and from #WestCoast";

var hashtags = FlowdockText.extractHashtags(statement);

var user_id = 270;

console.log(hashtags);



/* TODO create an internal system of IDs for every node because then it would add new relaitons between the same nodes just because the creator/context/statement is different - that's what we need.
   This will probably be done by first querying the context and statement to see if they exist.
   If yes, we create another transaction where all the references to users, statements, and contexts are done through their IDs
   Later the same thing might be necessary for nodes as well, but for now we can leave it as it is, before phrases are supported.


   TODO Practically - Data Structure
   A user should have an ID generated first and it's carried into the session variable with him (not his internal ID)
   If we work with a context, it has been already created, so it already has an ID. If not, then generate an ID for it.
   If we work with a statement, it's always new, so a new ID is generated for it.

   The MERGE statement will always ensure that if we come in with some new data that HAS to be recorded, a new node / edge will be added into the system

   The nodes should probably also have a unique ID, but we can always add this in later as in this point we do not need that

   TODO After this above is done
   Implement this logic into the interface

   TODO After the interface is done
   Check the imput (statement and hashtags) for injections etc.

   TODO Formalize this logic into a post on Nodus Labs and for KnowNodes

   TODO After inputs are checked
   Add another login system, check MongoDB or mySQL, maybe MongoDB is better to support large document storage

   TODO Phrase support
   Add support for phrase tags

   TODO API
   Add all this functionality to APIs

   TODO Viz
   Visualize the graphs through Sigma

   TODO Interface
   Create better way to create contexts, etc. etc.


*/

// Construct CREATE Cypher query


function makeCypherQuery (user_id,concepts,statement,context,callback) {

    var index;

    matchUser = 'MATCH (u:User {name: "nassim"}) MERGE ';
    createContext = '(c:Context ' + '{name:"' + context + '"}) MERGE c-[:BY]->u MERGE ';
    createStatement = '(s:Statement ' + '{name:"#' + concepts[0];
    createNodesQuery = '(' + concepts[0] + ':Hashtag ' + '{name:"' + concepts[0] + '"})';
    createEdgesQuery = ' MERGE ' + concepts[0] +'-[:BY]->u MERGE ' + concepts[0] + '-[:OF {context:"' + context + '",user:"' + user_id + '"}]->s MERGE ' + concepts[0] + '-[:AT {user:"' + user_id + '"}]->c';


    for (index = 1; index < concepts.length; ++ index) {
        createNodesQuery += ' MERGE (' + concepts[index] + ':Hashtag ' + '{name:"' + concepts[index] + '"})';
        minusOne = index - 1;
        createEdgesQuery += ' MERGE ' + concepts[minusOne] + '-[:TO {context:"' + context + '",statement:"' + statement + '",user:"' + user_id + '"}]->' + concepts[index] + ' MERGE ' + concepts[index] + '-[:BY]->u MERGE ' + concepts[index] + '-[:OF {context:"' + context + '",user:"' + user_id + '"}]->s MERGE ' + concepts[index] + '-[:AT {user:"' + user_id + '"}]->c';
        createStatement += ' #' + concepts[index];
    }

    createStatement += '", text:"' + statement + '"}) MERGE s-[:BY]->u MERGE s-[:IN {user:"' + user_id + '"}]->c MERGE ';
    createNodesEdgesQuery = matchUser + createContext + createStatement + createNodesQuery + createEdgesQuery + ';';
    callback(createNodesEdgesQuery);

};


makeCypherQuery(user_id, hashtags, statement, context, function(query) {
    console.log(query);
} );






var addConcepts = {
    statements : [ {
        statement : 'CREATE (p:Hashtag {props}) RETURN p',
        parameters : {
            props : {
                name : 'Adam',
                timestamp : '',
                by: 22
            }
        }
    }]
};



/* db.insertNode({ name:'Darth Merengi', level: 99, hobbies: ['lightsaber fighting', 'cycling in space'], shipIds: [123, 321] }, 'User', function(err, result){
    console.log(result._id);
    console.log(result.hobbies);
}); */


/*

db.beginTransaction(function(err,returns) {
    if (err) throw err;
    console.log(returns);
});
*/

var d = new Date();

console.log(d.getTime());



