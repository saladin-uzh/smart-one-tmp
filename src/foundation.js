import _ from 'lodash';
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Search from 'material-ui/svg-icons/action/search';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import DatePicker from 'material-ui/DatePicker';
import AutoComplete from 'material-ui/AutoComplete';
import Chip from 'material-ui/Chip';
import SelectField from 'material-ui/SelectField';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import moment from 'moment';

export class MessageList extends Component {
  constructor(props) {
    super(props);
    //if (props.getMessages) {
    //  this.getMessages = props.getMessages.bind(this);
    //}
    if (props.sendMessage) {
      this.sendMessage = props.sendMessage.bind(this);
    }
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.state = {
      messages: props.messages,
      filteredMessages: props.messages
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      messages: props.messages,
      filteredMessages: props.messages
    })
  }

  //componentDidMount() {
  //  //const component = this;
  //  //global.externalApi.getNotifications().then((data)=> {
  //  //  const notifications = _.map(data, (msg) => {
  //  //    console.log('message', msg)
  //  //    const allAddressees = _.uniq(_.map(msg.m_house, (addr)=> {
  //  //      return addr.House.split('-')[1]
  //  //    }));
  //  //    const displayAddressees = msg.m_house.length > 4 ? `${allAddressees[0]}, ${allAddressees[1]}, ${allAddressees[2]} and ${allAddressees.length - 3} others` : _.sum(_.map(allAddressees, (a)=>{return a + ' '}));
  //  //    return {
  //  //      subject: msg.m_subject,
  //  //      type: msg.m_type,
  //  //      message: msg.m_content,
  //  //      allSentTo: allAddressees,
  //  //      sentTo: displayAddressees,
  //  //      sendDate: moment(msg.m_wdate, 'YYYYMMDDHHmm').unix(),
  //  //      expires: moment(msg.m_edate, "YYYYMMDDHHmm").unix()
  //  //    }
  //  //  });
  //  //  component.setState({messages: notifications, filteredMessages: notifications});
  //  //  console.log('getMessages', notifications)
  //  //});
  //    //this.getMessages().then(function (messages) {
  //    //  component.setState({messages: messages, filteredMessages: messages});
  //    //})
  //}

  handleSearchChange(searchText) {
    if (_.isEmpty(searchText)) {
      this.setState({filteredMessages: this.state.messages});
    } else {
      let foundMessages = _.filter(this.state.messages, (msg)=>{
        return msg.message.toLowerCase().includes(searchText.toLowerCase()) || (_.findIndex(msg.allSentTo, (addr) => {return addr.toLowerCase().includes(searchText.toLowerCase())}) >= 0);
      });
      this.setState({filteredMessages: foundMessages});
    }
  }

  handleDelete(entity) {
    this.props.onDelete(entity);
  }

  render() {
    return (
    <div>
      <SearchAutoSuggest onSearchChange={this.handleSearchChange} hintText="Unit number, riser, floor" />
      <List style={{textAlign: 'left', height: '400px', maxHeight: '50%', overflowY: 'auto'}}>
        { _.map(this.state.filteredMessages, (msg) => {
          return (
            <MessageListItem message={msg} onDelete={this.handleDelete}/>
          )
        })}
      </List>
    </div>
    )
  }
}

export class MessageListItem extends Component {
  constructor(props) {
    super(props)
    this.handleDelete = this.handleDelete.bind(this);
    this.state = {
      buildingId: this.props.buildingId,
      showDetail: false
    }
  };

  handleDelete() {
    this.setState({showDetail: false});
    this.props.onDelete(this.props.message)
  };

  render() {
    const iconButtonElement = (
      <IconButton
        touch={true}
        tooltip="more"
        tooltipPosition="bottom-left"
      >
        <MoreVertIcon color={grey400} />
      </IconButton>
    );
    
    const rightIconMenu = (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem onClick={this.handleDelete}>Delete</MenuItem>
      </IconMenu>
    );

    const messagelines = this.props.message.message.split('\n');

    return (
      <div>
        <div style={{display:this.state.showDetail ? 'none':'block'}}>
          <ListItem
            leftAvatar={<Avatar>{this.props.message.type.substring(0,1)}</Avatar>}
            rightIconButton={rightIconMenu}
            primaryText={<div> {this.props.message.subject} <div style={{position:'absolute', right:'50px', top:'15px'}}>{moment.unix(this.props.message.sendDate).format('l')}</div></div>}
            secondaryText={
              <p>
              <b>to suites {this.props.message.sentTo}</b><br/>
              {this.props.message.message}
              </p>
            }
            secondaryTextLines={2}
            onClick={() => {this.setState({showDetail: !this.state.showDetail})}}
          />
        </div>
        <div style={{display: this.state.showDetail ? 'block':'none',backgroundColor: 'rgba(164,207,95,0.2)', zIndex: -1}}>
          <ListItem
            leftAvatar={<Avatar>{this.props.message.type.substring(0,1)}</Avatar>}
            rightIconButton={rightIconMenu}
            primaryText={<div> {this.props.message.subject} <div style={{position:'absolute', right:'50px', top:'15px'}}>{moment.unix(this.props.message.sendDate).format('l')}</div></div>}
            secondaryText={
              <p>
              <b>to suites {this.props.message.sentTo}</b><br/>
              Expires {moment.unix(this.props.message.expires).format('l')}
              </p>
            }
            secondaryTextLines={2}
            onClick={() => {this.setState({showDetail: !this.state.showDetail})}}
          />
        </div>
        <div style={{marginBottom:'20px',marginTop:'20px',display: this.state.showDetail ? 'block':'none'}}>
        { _.map(messagelines, (line) => {
                        return (
                          <span>
                            {line}<br/>
                          </span>
                        )
                      })}
        </div>
        <Divider inset={false}/>
      </div>
    )
  }
}

export class SearchAutoSuggest extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onSearchChange(e.target.value);
  }

  render() {
    return (
      <div style={this.props.style}>
        <Search style={{marginRight: 24}}/>
        <TextField onChange={this.handleChange} hintText={this.props.hintText}/>
      </div>
    )
  }
}

export class ComposeMessageDialog extends Component {
  constructor(props) {
    super(props);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.updateToAddress = this.updateToAddress.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.updateSubject = this.updateSubject.bind(this);
    this.state = {
      open: this.props.open,
      to: [],
      message: '',
      subject: '',
      autoCompleteTo: this.props.addresses
    };
  }

  updateToAddress(newAddress) {
    console.log('setting new addresses', newAddress)
    this.setState({to: newAddress});
  }

  updateMessage(event, newMessage) {
    this.setState({message: newMessage})
  }

  updateSubject(event, newSubject) {
    this.setState({subject: newSubject})
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSend = () => {
    this.forceUpdate();
    this.props.onSend(this.props.buildingId,this.state.to,this.state.subject,this.state.message)
    this.setState({open: false});
  };

  render() {
    const actions = [
      <FlatButton
        key="cancel"
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        key="send"
        label="Send"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleSend}
      />,
    ];

    return (
      <div>
        <Dialog
          title="Compose Message"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <AutoCompleteToAddress
            addressOptions={/*{
              'All suites': ['101','102','105'],
              'Suite 101': ['101'],
              'Suite 102': ['102'],
              'Suite 105': ['105'],
              'Floor 1': ['101','102'],
              'Floor 2': ['105']}*/
              this.props.addressOptions}
            handleAddressUpdate={this.updateToAddress}/><br/>
          {/*<div style={{display:"inline"}}><DatePicker hintText="Expires" container="inline"/></div>*/}
          <TextField floatingLabelText="Subject" floatingLabelFixed={true} multiLine={true} rows={2} rowsMax={8} fullWidth={true} onChange={this.updateSubject}/>
          <TextField floatingLabelText="Message" floatingLabelFixed={true} multiLine={true} rows={2} rowsMax={8} fullWidth={true} onChange={this.updateMessage}/>
        </Dialog>
        <FloatingActionButton style={{position: 'absolute', right: '20px'}} onClick={this.handleOpen}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}

export class AutoCompleteSearch extends Component {
  constructor(props) {
    super(props);
    this.filterOptions = this.filterOptions.bind(this);
    this.handleUpdateInput = this.handleUpdateInput.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.state = {
      searchText: '',
      selected: []
    }
  }

  filterOptions(searchText, key) {
    if (_.isEmpty(searchText) || _.isEmpty(key)) {
      return false;
    }

    let searchTextWords = searchText.toLowerCase().split(' ');
    let lowerKey = key.toLowerCase();
    return _.reduce(searchTextWords, (found, word)=> {return found || lowerKey.indexOf(word) != -1}, false);
  }

  handleUpdateInput(searchText) {
    this.setState({
      searchText: searchText
    });
  };

  handleSelection(chosen, index) {
    if (index != -1 ) {
      this.setState({
        selected: chosen,
        searchText: ''
      });
      console.log('selected:',chosen)
      this.props.handleAddressUpdate(this.props.addressOptions[chosen])
    }
  }

  render() {
    return (
      <div>
        <Search style={{marginRight: 24}}/>
        <AutoComplete
          dataSource={_.keys(this.props.addressOptions)}
          searchText={this.state.searchText}
          hintText={this.props.hintText}
          filter={this.filterOptions}
          onNewRequest={this.handleSelection}
          onUpdateInput={this.handleUpdateInput}
        />
      </div>
    )
  }
}

export class AutoCompleteToAddress extends Component {
  constructor(props) {
    super(props);
    this.filterOptions = this.filterOptions.bind(this);
    this.handleUpdateInput = this.handleUpdateInput.bind(this);
    this.renderSelected = this.renderSelected.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.handleDeleteSelection = this.handleDeleteSelection.bind(this);
    this.state = {
      searchText: '',
      selected: [],
      selectedChips: []
    }
  }

  filterOptions(searchText, key) {
    if (_.isEmpty(searchText) || _.isEmpty(key)) {
      return false;
    }
    return searchText !== '' && key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
    //let searchTextWords = searchText.toLowerCase().split(' ');
    //let lowerKey = key.toLowerCase();
    //return _.reduce(searchTextWords, (found, word)=> {return found || lowerKey.indexOf(word) != -1}, false);
  }

  handleUpdateInput(searchText) {
    this.setState({
      searchText: searchText
    });
  };

  renderSelected(selected) {
     return _.map(selected, (item) => {
     return (
       <Chip style={{display: "inline-flex", margin: "0 10px 0 0"}} onRequestDelete={()=>{this.handleDeleteSelection(item)}}>{item}</Chip>
     )
    })
  }

  handleSelection(chosen, index) {
    if (index != -1 ) {
      let selected = this.state.selected;
      let newSelected = _.concat(selected, chosen);
      this.setState({
        selected: newSelected,
        selectedChips: this.renderSelected(newSelected),
        searchText: ''
      });
      this.props.handleAddressUpdate(_.uniq(
        _.flatten(
          _.map(newSelected, (s)=>{return this.props.addressOptions[s]})
        )))
    } else {
      // even if we haven't
    }
  }

  handleDeleteSelection(chosen) {
    let newSelected = _.without(this.state.selected, chosen);
    this.setState({selected: newSelected, selectedChips: this.renderSelected(newSelected) });
    this.props.handleAddressUpdate(_.uniq(
      _.flatten(
        _.map(newSelected, (s)=>{return this.props.addressOptions[s]})
      )))
  }


  render() {
    return (
      <div>
        <div style={{width:"100%"}}>{this.state.selectedChips}</div>
        <AutoComplete
          dataSource={_.keys(this.props.addressOptions)}
          floatingLabelText="To"
          floatingLabelFixed={true}
          fullWidth={true}
          searchText={this.state.searchText}
          filter={this.filterOptions}
          onNewRequest={this.handleSelection}
          onUpdateInput={this.handleUpdateInput}
          listStyle={{ maxHeight: 200, overflow: 'auto' }}
        />
      </div>
    )
  }
}

export class EntityCrudSummaryCard extends Component {
  constructor(props) {
    super(props)
    this.handleEntitySave = this.handleEntitySave.bind(this);
    this.handleEntityAdd = this.handleEntityAdd.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleEntitySelection = this.handleEntitySelection.bind(this);
    this.handleEntitiesDelete = this.handleEntitiesDelete.bind(this);
    this.state = {
      filteredEntities: this.props.entities,
      clickedEntity: {},
      selectedEntities: {},
      emptyEntity:{...this.props.emptyEntity},
      showEditDialog: false,
      showAddDialog: false
    }

  }

  componentWillReceiveProps(nextProps)
  {
    this.setState({filteredEntities: nextProps.entities});
  }

  shouldComponentUpdate(nextProps, nextState)
  {
    if (nextState.filteredEntities != this.state.filteredEntities) return true;
    if (nextState.showEditDialog != this.state.showEditDialog) return true;
    if (nextState.showAddDialog != this.state.showAddDialog) return true;
    return false;
  }

  handleEntitySave(entity) {
    var value = this.props.onEntitySave(entity);
    if(!String.isNullOrEmpty(value))
    {
      return value;
    }
    else
    {
      this.setState({showEditDialog: false});
      return '';
    }
  }

  handleEntityAdd(entity) {
    var value = this.props.onEntityAdd(entity);
    if(!String.isNullOrEmpty(value))
    {
      return value;
    }
    else
    {
      this.setState({showAddDialog: false});
      return '';
    }
  }

  handleEntitiesDelete() {
    this.props.onEntitiesDelete(this.state.selectedEntities);
  }

  handleSearchChange(searchText) {
    if (_.isEmpty(searchText)) {
      this.setState({filteredEntities: this.props.entities});
    } else {
      let foundEntities = _.filter(this.props.entities, (ent)=>{
        return !_.isUndefined(_.find(ent, (value, key) => {
          return value.toString().toLowerCase().includes(searchText.toLowerCase())
        }))
      });
      this.setState({filteredEntities: foundEntities});
    }
  }

  handleEntitySelection(selectedIndices) {
    const selectedEntities = _.map(selectedIndices, (i)=>{return this.state.filteredEntities[i]})

    this.setState({selectedEntities: selectedEntities});
  }

  render() {
    const component = this;
    return (
      <div>
        <Card style={{textAlign: 'left', margin:'20px'}}>
          {/*<CardTitle
          title={this.props.entityName}
          style={{padding: '8px 16px 0 16px'}}/>*/}
        <CardText style={{padding: '0 16px 0 16px'}}>
          <span style={{fontSize: '24px', color:'rgba(0,0,0,0.87)', lineHeight: '36px'}}>{this.props.entityName}</span>
          <SearchAutoSuggest onSearchChange={this.handleSearchChange} hintText={this.props.searchHintText} style={{display:'inline-block',height:'36px',marginLeft:'50px'}}/>
          <div>
            <Table
              height={'150px'}
              selectable={true}
              multiSelectable={true}
              onCellClick={(row,column) =>{
                console.log(`clicked row ${row}, column ${column}`);
               if (column >= 0) {
                 component.setState({
                  clickedEntity: component.state.filteredEntities[row],
                  showEditDialog: true,
                  showAddDialog: false
                });
              }
              }}
              onRowSelection={(selected)=>{
                console.log('selected rows',selected)
                let selectedIndices = [];

                if (Array.isArray(selected)) {
                  selectedIndices = selected;
                } else {
                  if (selected == 'all') {
                    selectedIndices = _.range(this.state.filteredEntities.length)
                  }
                  if (selected == 'none') {
                    selectedIndices = [];
                  }
                }

                this.handleEntitySelection(selectedIndices)

                }}>
              <TableHeader >
                <TableRow>
                    { _.map(this.props.entityProperties, (Property) => {
                      return (
                        <TableHeaderColumn>{_.capitalize(Property.label)}</TableHeaderColumn>
                      )
                    })}
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={true} showRowHover={true} deselectOnClickaway={false}>
                { _.map(this.state.filteredEntities, (entity) => {
                  return (
                    <TableRow>
                      { _.map(this.props.entityProperties, (Property) => {
                        return (
                          <TableRowColumn>
                            {entity[Property.name]}
                          </TableRowColumn>
                        )
                      })}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardText>
        <CardActions>
          <RaisedButton
            label='New'
            primary={false}
            style={{marginRight:'2em'}}
            disabled={this.props.disableAdd}
            onClick={()=>{
                component.setState({
                showEditDialog: false,
                showAddDialog: true
                });
              }}/>
        {!this.props.disableDelete?
          (<FlatButton
            label="Delete"
            onClick={this.handleEntitiesDelete}/>):''}
        </CardActions>
        </Card>
        { this.state.showEditDialog && !this.props.disableEdit? ( <EntityCrudEditDialog
          entityName={this.props.entityName}
          title={this.props.EditEntityLable}
          entitySchema={this.props.entitySchema}
          entity={this.state.clickedEntity}
          action = 'Edit'
          open={true}
          onEntitySave={this.handleEntitySave}
          handleClose={()=>{this.setState({showEditDialog: false})}}
        />) : ''}
        { this.state.showAddDialog && !this.props.disableAdd? ( <EntityCrudEditDialog
          entityName={this.props.entityName}
          title={this.props.NewEntityLable}
          entitySchema={this.props.entitySchema}
          entity={{...this.props.emptyEntity}}
          action = 'New'
          open={true}
          onEntitySave={this.handleEntityAdd}
          handleClose={()=>{this.setState({showAddDialog: false})}}
        />) : ''}
      </div>
    )

  }
}

export class EntityCrudEditDialog extends Component {
  constructor(props) {
    super(props);
    this.state={
      entity: this.props.entity,
      action: this.props.action,
      openAlert: false,
      AlertMessage:''
    };
    this.handleOpenAlert = this.handleOpenAlert.bind(this);
    this.handleCloseAlert = this.handleCloseAlert.bind(this);
  }

  handleOpenAlert(alertMessage){
    this.setState({openAlert: true,AlertMessage:alertMessage});
  };

  handleCloseAlert(){
    this.setState({openAlert: false});
  };

  render() {

    const actions = [
      <FlatButton
        key="cancel"
        label="Cancel"
        primary={true}
        onClick={this.props.handleClose}
      />,
      <FlatButton
        key="save"
        label="Save"
        primary={true}
        keyboardFocused={true}
        onClick={()=>{
          var value = this.props.onEntitySave(this.state.entity);
          if(!String.isNullOrEmpty(value))
          {
            this.handleOpenAlert(value);
          }
        }}
      />
    ];

    const alertActions = [
      <FlatButton
        key="ok"
        label="OK"
        primary={true}
        onClick={this.handleCloseAlert}
      />
    ];

    const component=this;

    return (
      <div>
        <Dialog
          title={this.props.title?this.props.title:`${this.state.action} ${this.props.entityName}`}
          actions={actions}
          modal={false}
          open={this.props.open}
          onRequestClose={this.props.handleClose}
          autoScrollBodyContent={true}
        >
          { _.map(this.props.entitySchema, (property)=>{
            if(property.type === 'text')
            {
              return (
                <EntityCrudTextField
                  label={_.capitalize(property.label)}
                  value={component.state.entity[property.name]}
                  handleChange={(value)=>{
                    let valueObj = {};
                    valueObj[property.name] = value;
                    component.setState({entity: _.assign(component.state.entity, valueObj)})}
                  }
                />
              )
            }
            else if(property.type === 'options')
            {
              return (
                <EntityCrudSelectField
                  label={_.capitalize(property.label)}
                  value={component.state.entity[property.name]}
                  optionValues={property.optionValues}
                  handleChange={(value)=>{
                    let valueObj = {};
                    valueObj[property.name] = value;
                    component.setState({entity: _.assign(component.state.entity, valueObj)})}
                  }
                />
              )
            }
          })}
            <Dialog
              actions={alertActions}
              modal={true}
              open={this.state.openAlert}
              onRequestClose={this.handleCloseAlert}
            >
              {this.state.AlertMessage}
            </Dialog>
        </Dialog>
      </div>
    )
  }
}

export class EntityCrudTextField extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <TextField
        floatingLabelText={this.props.label}
        floatingLabelFixed={true}
        multiLine={true}
        rows={1}
        fullWidth={true}
        value={this.props.value}
        onChange={(event,value)=>{this.props.handleChange(value)}
        }
      />
    )
  }
}

export class EntityCrudSelectField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
    };
  }

  render() {
    return(
      <SelectField
        floatingLabelText={this.props.label}
        floatingLabelFixed={true}
        fullWidth={true}
        value={this.props.value}
        onChange={(event, index, value)=>{this.props.handleChange(value)}}
      >
        { _.map(this.props.optionValues, (v)=>{
          return (
            <MenuItem 
              value={v.value}
              primaryText={v.display}
            />
          )
        })}
      </SelectField>
    )
  }
}

