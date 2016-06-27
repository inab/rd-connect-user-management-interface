// The app's complete current state
var state = 
  {
    transitioning: false,
    location: null,
    users: [
      {
        key: "1", 
        title: "Mr", //Dr, Prof, Mr, Mrs, Miss, etc.
        firstName: "Andres", 
        lastName: "Canada", 
        email: "acanada@cnio.es", 
        position: "Technician", 
        institutionName:"CNIO",
        institutionWebsite:"http://www.cnio.es",
        institutionNature:"Healthcare facility",//university, university hospital, healthcare facility, biobank, registry
        nameOfDepartment:"Spanish National Bioinformatics Institute"
      },
      {
        key: "2", 
        title: "Mr", //Dr, Prof, Mr, Mrs, Miss, etc.
        firstName: "Lucas", 
        lastName: "Canada", 
        email: "lcanada@cnio.es", 
        position: "Bioinformatician", 
        institutionName:"CNIB",
        institutionWebsite:"http://www.cnio.es",
        institutionNature:"Healthcare facility",//university, university hospital, healthcare facility, biobank, registry
        nameOfDepartment:"Spanish National Bioinformatics Institute"
      },
    ],
    newUserForm: Object.assign({}, USER_TEMPLATE),
    userForms: {},
};

// Make the given changes to the state and perform any required housekeeping
function setState(changes) {
  var Sidebar = require('react-sidebar').default;
  Object.assign(state, changes);
  if(!state.transitioning){
    ReactDOM.render(
      React.createElement(Application, state),
      document.getElementById('react-app')
    );
  }
}

//Handle browser navigation events
window.addEventListener('hashchange', navigated, false);

// Set the initial route and render the app
navigated();