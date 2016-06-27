/*
 * Constants
 */

var ROUTER = uniloc(
  // Routes
  { 
    listUsers: 'GET /users',
    postUser: 'POST /users',
    editUser: 'GET /users/:id',
  }, 

  // Aliases
  {
    'GET /': 'listUsers',
  }
);

var USER_TEMPLATE = {
  title: "", 
  firstName: "", 
  lastName: "", 
  email: "", 
  position: "", 
  institutionName: "", 
  institutionWebsite: "", 
  institutionNature: "", 
  nameOfDepartment: ""
};

var APPLICATION_CONFIG = {
  listUsers: {
    component: UsersView,
    actions: {
      onChange: updateNewUser,
      onSubmit: submitNewUser,
    },
    state: ['users', 'newUserForm'],
  },

  editUser: {
    component: UserView,
    actions: {
      onChange: updateUserForm,
      onSubmit: submitUserForm,
    },
    state: ['users', 'userForms'],
  },
};