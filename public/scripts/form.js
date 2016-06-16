/*var rootElement =
    React.createElement('div',{},
        React.createElement('h1',{},"Contacts"),
        React.createElement('ul',{},
            React.createElement('li',{},
                React.createElement('h2', {}, "Andres Canada"),
                React.createElement('a',{href:'mailto:acanada@cnio.es'}, "acanada@cnio.es")
            ),
            React.createElement('li',{},
                React.createElement('h2', {}, "Lucas Canada"),
                React.createElement('a',{href:'mailto:lucascanada@gmail.com'}, "lucascanada@gmail.com")
            )
        )
    )
ReactDOM.render(rootElement, document.getElementById('react-app'))
*/
var contacts = [
    {key: 1, name: "James K Nelson", email: "james@jamesknelson.com", description: "Front-end Unicorn"},
    {key: 2, name: "Jim", email: "jim@example.com", description: "Front-end Unicorn 2"},
    {key: 3, name: "Joe", email: "joe@example.com"},
]

/*var listElements = contacts
    .filter(function(contact) { return contact.email; })
    .map(function(contact){
        return React.createElement('li',{key: contact.key},
            React.createElement('h2', {}, contact.name),
            React.createElement('a',{href: 'mailto:'+contact.email}, contact.email)
        )
    }
)
*/

var newContact = {name: "", email: "", description: ""}

var ContactItem = React.createClass({
    propTypes:{
        name: React.PropTypes.string.isRequired,
        email: React.PropTypes.string.isRequired,
        description: React.PropTypes.string
    },

    render: function(){
      return(
            React.createElement('li',{className:'ContactItem'},
                React.createElement('h2', {className:'ContactItem-name'}, this.props.name),
                React.createElement('a', {href:'mailto:'+this.props.email, className:'ContactItem-email'}, this.props.email),
                React.createElement('div', {className:'ContactItem-description'}, this.props.description)
            )
        )
    },
});


var contactItemElements = contacts
  .filter(function(contact) { return contact.email })
  .map(function(contact) { return React.createElement(ContactItem, contact) })


var ContactForm = React.createClass({
    propTypes:{
        contact:React.PropTypes.object.isRequired
    },

    render:function(){
        return(
                React.createElement('form',{className:'Contact-form'},
                    React.createElement('input',{
                        type:'text',
                        className:'Input-name',
                        placeholder:'Name (Required)',
                        value:this.props.contact.name,
                    }),
                    React.createElement('input',{
                        type:'email',
                        className:'Input-email',
                        placeholder:'Email (Required)',
                        value:this.props.contact.email,
                    }),
                    React.createElement('textarea',{
                        placeholder:'Description',
                        value:this.props.contact.description,
                    }),
                    React.createElement('button',{
                        type:'submit'
                    }, 'Add a contact')
                )
            )
    },
});

var ContactView = React.createClass({
    propTypes:{
        contacts: React.PropTypes.array.isRequired,
        newContact: React.PropTypes.object.isRequired,
    },
    render:function(){
        var contactItemElements = this.props.contacts
        .filter(function(contact) { return contact.email })
        .map(function(contact) { return React.createElement(ContactItem, contact) })

    return (
      React.createElement('div', {className: 'ContactView'},
        React.createElement('h1', {className: 'ContactView-title'}, "Contacts"),
        React.createElement('ul', {className: 'ContactView-list'}, contactItemElements),
        React.createElement(ContactForm, {contact: this.props.newContact})
      )
    )
    },    
})

var rootElement = React.createElement('div', {},
        React.createElement('h1', {}, "Contacts"),

        // If your `children` is an array, you'll need to give each one a unique `key`
        // prop. I'll explain why a little later.
        React.createElement('ul', {}, contactItemElements),
        React.createElement(ContactForm,{contact:newContact})
)

//ReactDOM.render(rootElement, document.getElementById ('react-app'))
ReactDOM.render(
  React.createElement(ContactView, {
    contacts: contacts,
    newContact: newContact
  }),
  document.getElementById('react-app')
)
