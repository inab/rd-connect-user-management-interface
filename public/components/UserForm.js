var UserForm = React.createClass({
  propTypes:{
    value: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired,
  },
  onTitleInput: function(e){
    this.props.actions.onChange(Object.assign({}, this.props.value,{title: e.target.value}));
  },
  onFirstNameInput: function(e){
    this.props.actions.onChange(Object.assign({}, this.props.value,{firstName: e.target.value}));
  },
  onLastNameInput: function(e){
    this.props.actions.onChange(Object.assign({}, this.props.value,{lastName: e.target.value}));
  },
  onEmailInput: function(e){
    this.props.actions.onChange(Object.assign({}, this.props.value,{email: e.target.value}));
  },
  onPositionInput: function(e){
    this.props.actions.onChange(Object.assign({}, this.props.value,{position: e.target.value}));
  },
  onInstitutionNameInput: function(e){
    this.props.actions.onChange(Object.assign({}, this.props.value,{institutionName: e.target.value}));
  },
  onInstitutionWebsiteInput: function(e){
    this.props.actions.onChange(Object.assign({}, this.props.value,{institutionWebsite: e.target.value}));
  },
  onInstitutionNatureInput: function(e){
    this.props.actions.onChange(Object.assign({}, this.props.value,{institutionNature: e.target.value}));
  },
  onNameOfDepartmentInput: function(e){
    this.props.actions.onChange(Object.assign({}, this.props.value,{nameOfDepartment: e.target.value}));
  },
  onSubmit: function(e){
    e.preventDefault();
    this.props.actions.onSubmit();
  },

  /*componentDidUpdate: function(prevProps){
    var value = this.props.value;
    var prevValue = prevProps.value;
    if(this.isMounted && value.errors && value.errors != prevValue.errors){
      if(value.errors.title){
        this.refs.title.focus();
      }else if(value.errors.firstName){
        this.refs.firstName.focus();
      }else if(value.errors.lastName){
        this.refs.lastName.focus();
      }else if(value.errors.email){
        this.refs.email.focus();
      }else if(value.errors.position){
        this.refs.position.focus();
      }else if(value.errors.institutionName){
        this.refs.institutionName.focus();
      }else if(value.errors.institutionWebsite){
        this.refs.institutionWebsite.focus();
      }else if(value.errors.institutionNature){
        this.refs.institutionNature.focus();
      }else if(value.errors.nameOfDepartment){
        this.refs.nameOfDepartment.focus();
      }
    }
  },
  */
  render:function(){
    var errors = this.props.value.errors || {};
    return (
      React.createElement('form',{
        className:'UserForm',
        onSubmit: this.onSubmit,
        noValidate: true,
      },
        React.createElement('input',{
          type: 'text', 
          className: errors.title && 'UserForm-error',
          placeholder:"Title (Required)",
          value: this.props.value.title,
          onChange: this.onTitleInput,
          autoFocus: true,
        }),
        React.createElement('input',{
          type: 'text', 
          className: errors.firstName && 'UserForm-error',
          placeholder:"First Name (Required)",
          value: this.props.value.firstName,
          onChange:this.onFirstNameInput,
          ref: 'firstName',
        }),
        React.createElement('input',{
          type: 'text', 
          className: errors.lastName && 'UserForm-error',
          placeholder:"Last Name (Required)",
          value: this.props.value.lastName,
          onChange:this.onLastNameInput,
        }),
        React.createElement('input',{
          type: 'email', 
          className: errors.email && 'UserForm-error',
          placeholder:"Email (Required)",
          value: this.props.value.email,
          onChange: this.onEmailInput,
          ref: 'email',
          noValidate: true,
        }),
        React.createElement('input',{
          type: 'text', 
          className: errors.position && 'UserForm-error',
          placeholder:"Position (Required)",
          value: this.props.value.position,
          onChange: this.onPositionInput,
        }),
        React.createElement('input',{
          type: 'text', 
          className: errors.institutionName && 'UserForm-error',
          placeholder:"Name of Institution (Required)",
          value: this.props.value.institutionName,
          onChange: this.onInstitutionNameInput,
        }),
        React.createElement('input',{
          type: 'text', 
          className: errors.institutionWebsite && 'UserForm-error',
          placeholder:"Insitution Website (Required)",
          value: this.props.value.institutionWebsite,
          onChange: this.onInstitutionWebsiteInput,
        }),
        React.createElement('input',{
          type: 'text', 
          className: errors.institutionNature && 'UserForm-error',
          placeholder:"Nature of Insitution (Required)",
          value: this.props.value.institutionNature,
          onChange: this.onInstitutionNatureInput,
        }),
        React.createElement('input',{
          type: 'text', 
          className: errors.nameOfDepartment && 'UserForm-error',
          placeholder:"Name of Department",
          value:this.props.value.nameOfDepartment,
          onChange: this.onNameOfDepartmentInput,
        }),
        React.createElement('button',{type: 'submit'}, "Save")
      ) 
    );
  },
});