import { useState, useEffect } from 'react';

import server from './services/server';
import './style/layout.css';
const NewPerson = ({ persons, setPersons, newName, setNewName, newPhone, setNewPhone }) => {
 
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value);
  };

  const handleNewPersonSubmit = (event) => {
    event.preventDefault();

    if (persons.some((person) => person.name.toLowerCase() === newName.toLowerCase())) {
      const personObject = persons.find((person) => person.name.toLowerCase() === newName.toLowerCase());
      handlePhonenumberChange(personObject.name, newPhone)
      //alert(`${newName} is already added on phonebook`);
    } else {
      const personObject = {
        name: newName,
        number: newPhone
      };

      server.create(personObject).then((newPerson) => {
        showNotification(`${personObject.name} is added to phonebook!`, 'lightyellow', 'yellow' )
        setPersons(persons.concat(newPerson));
        setNewName('');
        setNewPhone('');
      })

    }
  };

  const handlePhonenumberChange = (name, newPhone) => {
    
    const personObject = persons.find((person) => person.name === name);
    const updatedPersonObject = {
      ...personObject,
      number: newPhone
    };
    
    if (window.confirm(`${personObject.name} is in phonebook. replace old number (${personObject.number}) with new number: ${newPhone}?`)) {
      console.log("SWITCHHH NUMBERLARGKLFAGDÖLkgfdkÖFGDÖKLdfgsÖLKödFGKLDFSGKLKÖFDLGS")
      console.log(personObject.id)
      console.log(updatedPersonObject)
      server.switchNumber(personObject.id, updatedPersonObject)
        .then(() => {


          const updatedPersons = persons.map(person => {
            if (person.id === personObject.id) {
              return { ...person, number: newPhone };
            }
            return person;
          });
          setPersons(updatedPersons);
          showNotification(`${personObject.name} phonenumber is updated`, 'lightgreen', 'green' )
        })
        .catch(error => {
          showNotification(`${personObject.name} phonenumber updating was failed, try again`, 'lightgray', 'red' )
          console.log('Error switching number:', error)

          
        })
    }
    
   /*alert("You cant change number atm, we try to fix it as soon as possible. :P")*/
  };


  // This is just bad testing example. box can be wrong place if u do it like this but this is just practice :) 
  // or bad practice. because this is missing set part and it should not done in DOM like this. i just wanted to try out how this work at all.
  const showNotification = (message, lightcolor, darkcolor) => {
    // Create a div element for the notification
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '300px';
    notification.style.left = '380px';
    notification.style.padding = '20px';
    notification.style.fontSize = '20px';
    notification.style.background = lightcolor;
    notification.style.border = `2px solid ${darkcolor}`;
  
    // Append the notification to the body
    document.body.appendChild(notification);
  
    // Hide the notification after 3 seconds
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 5000);
  };
  


  return (
    <div>
      
      <form onSubmit={handleNewPersonSubmit}>
      <h3> NAME:&nbsp;&nbsp;&nbsp; <input value={newName} onChange={handleNameChange} /></h3>
        <h3>PHONE:&nbsp; <input value={newPhone} onChange={handlePhoneChange} /></h3>
        <p> <button type="submit">Add Person</button></p>
      </form>
      <hr></hr>
    </div>
  );
};


const SearchResults = ({ persons, searchByName, handleRemovePerson }) => {
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchByName)
  );

  return (
    <div className="container">
      {filteredPersons.map((person) => (
        <div className="divroundedbox" key={person.name}>
          <p>Name: {person.name}</p>
          <p>Phone: {person.number}</p>
          <button onClick={() => handleRemovePerson(person.id)}>Delete Person</button>
          <hr></hr>
        </div>
      ))}
    </div>
  );
};

const FilterResults = ({searchByName, setSearchByName}) => {

  const handleSearchByNameChange = (event) => {
    setSearchByName(event.target.value.toLowerCase());
  };
  return(
    <div>
    <h3>Search by name: <input value={searchByName} onChange={handleSearchByNameChange} /></h3>
    <hr></hr>
    </div>
  );
};




const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [searchByName, setSearchByName] = useState('');
  const [removeMessage, setRemoveMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  useEffect(() => {
    server.getAll().then((initialPersons) => {
      console.log("initialPersons")
      console.log(initialPersons)
      setPersons(initialPersons);
    });
  }, []);

  const handleRemovePerson = (id) => {
    const personName = persons.find((person) => person.id === id).name;

    if (window.confirm(`Confirm: Delete ${personName} from phonebook?`)) {
      server.deletePerson(id)
        .then(() => {

          setRemoveMessage(
            `${personName} is removed from phonebook!`
          )
          setTimeout(() => {
            setRemoveMessage(null)
          }, 5000)
          window.scrollTo(0, 0);
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          setErrorMessage('Error deleting person. Person is already removed from database? Please try again later.');
          console.log('Error deleting person:', error)
          setTimeout(() => {
            setRemoveMessage(null)
          }, 5000)
          window.scrollTo(0, 0);
        })
    }
  }
  
  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className="error">
        {message}
      </div>
    )
  }

  const NotificationError = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className="error">
        {message}
      </div>
    )
  }
  




  return (
    <div>
       <NotificationError message={errorMessage} />
      <h1>PhoneBook</h1>
      <FilterResults searchByName={searchByName} setSearchByName={setSearchByName} />

      <h2>Add New</h2>
      <NewPerson
        persons={persons}
        setPersons={setPersons}
        newName={newName}
        setNewName={setNewName}
        newPhone={newPhone}
        setNewPhone={setNewPhone}
      />

      <h2>Numbers:</h2>
      <Notification message={removeMessage} />
       <SearchResults persons={persons} searchByName={searchByName} handleRemovePerson={handleRemovePerson}/>
      <hr></hr>
      <center> Created by Jesse K</center>
      <hr></hr>
      <hr></hr>

    </div>
  );
};

export default App;
