import React from 'react'
import _ from "lodash";
let del = [];
const initialEmployees = [
  {
    id: 1,
    name: 'Anar',
    surname: 'Aliyev',
    date: "12-12-1995",
    pos: 'Data Scientist',
    num: "0504227823"
  }, {
    id: 2,
    name: 'Akshin',
    surname: 'Qarayev',
    date: "23-11-1980",
    pos: 'PMO',
    num: "0505055555"
  }, {
    id: 3,
    name: 'Ali',
    surname: 'Bobrov',
    date: "10-09-1989",
    pos: 'Backend Engineer',
    num: "0503210343"
  }, {
    id: 4,
    name: 'Vitor',
    surname: 'Belfort',
    date: "08-01-1988",
    pos: 'Project Coordinator',
    num: "0555551243"
  }, {
    id: 5,
    name: 'Francis',
    surname: 'Ngannou',
    date: "12-05-1985",
    pos: 'SRE',
    num: "0707072321"
  }, {
    id: 6,
    name: 'Farzane',
    surname: 'Shalrous',
    date: "01-05-1989",
    pos: 'DevOps',
    num: "0511232134"
  }
];
let tmpArr = [];
let editedEmployees = [];






class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.state.filterText = "";
    this.state.employees = _.cloneDeep(initialEmployees);

  }
  handleUserInput(filterText) {
    this.setState({filterText: filterText});
  };
  handleRowDel(employee) {
    tmpArr = _.cloneDeep(this.state.employees);
    let index = this.state.employees.indexOf(employee);
    this.state.employees.splice(index, 1);
    this.setState(this.state.employees);
    editedEmployees = editedEmployees.filter(employee => !editedEmployees.includes(employee));
    del.push(employee);
    console.log(tmpArr);


  };
  undoingDelete(){
    if(tmpArr.length != 0){
      this.setState({employees: tmpArr})
      del.pop();
    }

  }

  viewDeleted(){
    let t = _.cloneDeep(this.state.employees)
    let result = t.filter(o1 => !initialEmployees.some(o2 => o1.name === o2.name && o1.surname == o2.surname && o1.date == o2.date && o1.pos == o2.pos && o1.num == o2.num));
    console.log(result);
    alert("updated:" + JSON.stringify(result) +'\n' + "deleted:" + JSON.stringify(del));
  }

  reset(){
    del = [];
    this.setState({employees: _.cloneDeep(initialEmployees)});
  }

  handleEmployeeTable(evt) {
    let numberPattern=/^\d+$/;
    let item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value
    };
    let employees = this.state.employees.slice();
    let newEmployees = employees.map(function(employee) {

      for (let key in employee) {
        if (key == item.name && employee.id == item.id) {
          if(employee[key] !== item.value){
            editedEmployees.push(employee.id);
            console.log(editedEmployees);
          }
          employee[key] = item.value;
          if(!numberPattern.test(employee.num)){
            alert("Please enter digits!");
          }
        }
      }



      return employee;
    });
    this.setState({employees:newEmployees});


  };
  render() {

    return (
        <div>
          <SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput.bind(this)}/>
          <EmployeeTable onEmployeeTableUpdate={this.handleEmployeeTable.bind(this)}
                        showDeleted={this.viewDeleted.bind(this)}
                        resetValues = {this.reset.bind(this)}
                        onRowDel={this.handleRowDel.bind(this)}
                        undoDelete = {this.undoingDelete.bind(this)}
                        employees={this.state.employees}
                        filterText={this.state.filterText}/>
        </div>
    );

  }

}
class SearchBar extends React.Component {
  handleChange() {
    this.props.onUserInput(this.refs.filterTextInput.value);
  }
  render() {
    return (
        <div>

          <input type="text" placeholder="Search..." value={this.props.filterText} ref="filterTextInput" onChange={this.handleChange.bind(this)}/>

        </div>

    );
  }

}

class EmployeeTable extends React.Component {

  render() {
    let onEmployeeTableUpdate = this.props.onEmployeeTableUpdate;
    let rowDel = this.props.onRowDel;
    let filterText = this.props.filterText;
    let employee = this.props.employees.map(function(employee) {
      if (employee.name.indexOf(filterText) === -1 && employee.surname.indexOf(filterText) === -1 && employee.date.indexOf(filterText) === -1 && employee.pos.indexOf(filterText) === -1 && employee.num.indexOf(filterText) === -1) {
        return;
      }
      return (<EmployeeRow onEmployeeTableUpdate={onEmployeeTableUpdate} employee={employee} onDelEvent={rowDel.bind(this)} key={employee.id}/>)
    });
    return (
        <div>


          <button type="button" onClick={this.props.showDeleted} className="btn btn-success pull-right">Submit</button>
          <button type="button" onClick={this.props.resetValues} className="btn btn-success pull-right">Reset</button>
          <button type="button" onClick={this.props.undoDelete} className="btn btn-success pull-right">Undo</button>

          <table className="table table-bordered">
            <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Surname</th>
              <th>Date of birth</th>
              <th>Position</th>
              <th>Phone number</th>
            </tr>
            </thead>

            <tbody>

            {employee}




            </tbody>

          </table>
        </div>
    );

  }

}

class EmployeeRow extends React.Component {
  onDelEvent() {
    this.props.onDelEvent(this.props.employee);

  }
  render() {

    return (
        <tr className="eachRow">
          <EditableCell cellData={{
            disabled: true,
            type : "id",
            value: this.props.employee.id,
            id: this.props.employee.id
          }}/>
          <EditableCell onEmployeeTableUpdate={this.props.onEmployeeTableUpdate} cellData={{
            type: "name",
            value: this.props.employee.name,
            id: this.props.employee.id
          }}/>
          <EditableCell onEmployeeTableUpdate={this.props.onEmployeeTableUpdate} cellData={{
            type: "surname",
            value: this.props.employee.surname,
            id: this.props.employee.id
          }}/>
          <EditableCell onEmployeeTableUpdate={this.props.onEmployeeTableUpdate} cellData={{
            type: "date",
            value: this.props.employee.date,
            id: this.props.employee.id
          }}/>
          <EditableCell onEmployeeTableUpdate={this.props.onEmployeeTableUpdate} cellData={{
            type: "pos",
            value: this.props.employee.pos,
            id: this.props.employee.id
          }}/>
          <EditableCell onEmployeeTableUpdate={this.props.onEmployeeTableUpdate} cellData={{
            type: "num",
            validation: "email",
            required: "true",
            value: this.props.employee.num,
            id: this.props.employee.id
          }}/>
          <td className="del-cell">
            <input type="button" onClick={this.onDelEvent.bind(this)} value="X" className="del-btn"/>
          </td>
        </tr>
    );

  }

}
class EditableCell extends React.Component {

  render() {
    return (

        <td>

          <input required={this.props.cellData.required} disabled={this.props.cellData.disabled} type={this.props.cellData.validation} name={this.props.cellData.type} id={this.props.cellData.id} value={this.props.cellData.value} onChange={this.props.onEmployeeTableUpdate}/>

        </td>


    );

  }


}
export default App


