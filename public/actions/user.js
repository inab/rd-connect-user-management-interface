function _addValidationToUser(user){
  if(!user.title){
    user.errors.title=["Please enter your title (i.e: Mr, Mrs,...)"];
  } 
  if(!user.firstName){
    user.errors.firstName=["Please enter your First Name"];
  } 
  if(!user.lastName){
    user.errors.lastName=["Please enter your Last Name"];
  } 
  if(!user.email){
    user.errors.email=["Please enter your Email"];
  } 
  if (!/.+@.+\..+/.test(user.email)) {
    user.errors.email = ["Please enter a valid user's email"];
  }
  if(!user.position){
    user.errors.position=["Please enter your position"];
  } 
  if(!user.institutionName){
    user.errors.institutionName=["Please enter your Institution Name"];
  }
  if(!user.institutionWebsite){
    user.errors.institutionWebsite=["Please enter your Institution Website"];
  }
  if(!user.institutionNature){
    user.errors.institutionNature=["Please enter your Institution Nature"];
  }
  if(!user.nameOfDepartment){
    user.errors.nameOfDepartment=["Please enter the name of your Department"];
  }
}

function updateNewUser(user) {
  setState({ newUserForm: user });
}

function submitNewUser(){
  var user = Object.assign({}, state.newUserForm,{key:(state.users.length + 1) + '', errors: {}});

  _addValidationToUser(user);

  setState(
    Object.keys(user.errors).length === 0 
    ? 
      {
        newUserForm: Object.assign({}, USER_TEMPLATE),
        users: state.users.slice(0).concat(user),
      }
    : 
      { newUserForm: user }
  );
}

function updateUserForm(user){
  var update={};
  update[user.key] = user;
  var userForms= Object.assign(state.userForms, update);

  setState({userForms: userForms});
}


function submitUserForm(){
  var key= state.location.options.id;
  var userForm = state.userForms[key];

  if(!userForm){
    startNavigating('listUsers');
  }
  else{
    var user = Object.assign({}, userForm, {errors: {}});

    _addValidationToUser(user);

    var userForms = Object.assign({},state.userForms);
    var update = {userForms: userForms};

    if(Object.keys(user.errors).length === 0){
      delete userForms[key];
      update.users = state.users.slice(0).map(function(x){
        return x.key == key ? user : x
      });

      startNavigating('listUsers');
    }
    else{
      userForms[key]= user;
    }

    setState(update);
  }
}