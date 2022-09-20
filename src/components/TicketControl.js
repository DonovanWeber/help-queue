import React from "react";
import NewTicketForm from "./NewTicketForm";
import TicketList from "./TicketList";
import TicketDetail from "./TicketDetail";
import EditTicketForm from "./EditTicketForm";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import db from './../firebase';

function TicketControl() {
  
    const [formVisibleOnPage, setFormVisibleOnPage] = useState(false);
    const [mainTicketList, setMainTicketList] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [editing, setEditing] = useState(false);
    
    useEffect(() => { 
    const unSubscribe = onSnapshot(
      collection(db, "tickets"), 
      (collectionSnapshot) => {
        const tickets = [];
        collectionSnapshot.forEach((doc) => {
            tickets.push({
              names: doc.data().names, 
              location: doc.data().location, 
              issue: doc.data().issue, 
              id: doc.id
            });
        });
        setMainTicketList(tickets);
      }, 
      (error) => {
        // do something with error
      }
    );

    return () => unSubscribe();
  }, []);


  handleEditClick = () => {
    console.log("handleEditClick reached");
    this.setState({editing: true});
  }
  handleClick = () => {
    if(this.state.selectedTicket != null){
      this.setState({
        // formVisibleOnPage: false,
        selectedTicket: null,
        editing: false
      });
    }else {
      const { dispatch } = this.props;
      const action = {
        type: 'TOGGLE_FORM'
      }
      dispatch(action);
    // this.setState(prevState => ({
    //   formVisibleOnPage: !prevState.formVisibleOnPage
    // }));
  }
}   //confused about this one 

  handleAddingNewTicketToList = (newTicket) => {
    const { dispatch } = this.props;
    const { id, names, location, issue } = newTicket;
    const action = {
      type: 'ADD_TICKET',
      id: id,
      names: names,
      location: location,
      issue: issue,
    }
    dispatch(action);
    const action2 = {
      type: 'TOGGLE_FORM'
    }
    dispatch(action2)// dispatch is async 
    // this.setState({formVisibleOnPage: false});
  }

  handleEditingTicketInList = (ticketToEdit) => {
    const { dispatch } = this.props;
    const { id, names, location, issue } = ticketToEdit;
      const action = {
        type: 'ADD_TICKET',
        id: id,
        names: names,
        location: location,
        issue: issue,
      }
    dispatch(action);
    this.setState({
        editing: false,
        selectedTicket: null
      });
  }

  handleChangingSelectedTicket = (id) => {
  const selectedTicket = this.props.mainTicketList[id];
  this.setState({
    selectedTicket: selectedTicket
  });
}

  handleDeletingTicket = (id) => {
    const { dispatch } = this.props;
    const action = {
      type: 'DELETE_TICKET',
      id: id
    }
    dispatch(action);
    this.setState({
      selectedTicket: null
    });
  }

  render(){
    let currentlyVisibleState = null;
    let buttonText = null;
    if(this.state.editing) {
      currentlyVisibleState = <EditTicketForm ticket = {this.state.selectedTicket} onEditTicket = {this.handleEditingTicketInList}/>
      buttonText="Return to TicketList"
    }
    else if (this.state.selectedTicket != null){
      currentlyVisibleState = <TicketDetail 
      ticket = {this.state.selectedTicket} onClickingDelete = {this.handleDeletingTicket} 
      onClickingEdit = {this.handleEditClick} />
      buttonText="Return to Ticket List"
    } 
    else if(this.props.formVisibleOnPage) {
      currentlyVisibleState = <NewTicketForm onNewTicketCreation={this.handleAddingNewTicketToList}/>
      buttonText = "Return To Ticket List";
    } 
    else {
      currentlyVisibleState = <TicketList 
      ticketList= {this.props.mainTicketList} onTicketSelection= {this.handleChangingSelectedTicket}/>
      buttonText="Add Ticket";
    }
    return(
      <React.Fragment>
        {currentlyVisibleState}
        {<button onClick={this.handleClick}>{buttonText}</button>}
      </React.Fragment>
    );
  }
}
TicketControl.propTypes = {
  mainTicketList: PropTypes.object,
  formVisibleOnPage: PropTypes.bool
}

const mapStateToProps = state => {
  return {
    mainTicketList: state.mainTicketList,
    formVisibleOnPage: state.formVisibleOnPage
  }
}

TicketControl = connect(mapStateToProps)(TicketControl);


export default TicketControl;