import React from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import {DetailGridInfo, GridApi, GridReadyEvent} from 'ag-grid-community'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import './App.css';
// class AppState{
//   public gridApi: GridApi;
//   public perPage: number;
//   constructor(){
//     this.gridApi= {} as GridApi;
//     this.perPage=3;
//   }
// }
class AppClass extends React.Component{
  state:any;
  
  constructor(props:any){
    super(props);
    this.state = {
      gridApi:null,
      perPage:3
    }
  }
  public onGridReady:any = (params:DetailGridInfo):void=>{
    this.setState({
      gridApi: params.api
    });
  }
  componentDidMount(){
    this.setGridDataSource();
  }
  componentDidUpdate(){
    this.setGridDataSource();
  }
  setGridDataSource(){
    if (this.state.gridApi) {
      const dataSource = {
        getRows: (params:any) => {
          const page = params.endRow / this.state.perPage;
          fetch(`https://reqres.in/api/users?per_page=${this.state.perPage}&page=${page}`)
            .then(resp => resp.json())
            .then(res => {
              params.successCallback(res.data, res.total);
            }).catch(err => {
              params.successCallback([], 0);
            });
        }
      }

      this.state.gridApi.setDatasource(dataSource);
      //this.state.gridApi.setServerSideDatasource(dataSource);
    }
  }
  avatarFormatter = ({ value }: {value:any}) => {
    return <img src={value} width="50px" height="50px" />
  }
  render(){
    return (
      <div className="App">
        <h2>Server side pagination in the React AG Grid - <a href="https://www.cluemediator.com" target="_blank">Clue Mediator</a></h2>
        <div className="ag-theme-alpine ag-style">
          <AgGridReact
            pagination={true}
            rowModelType={'infinite'}
            paginationPageSize={this.state.perPage}
            cacheBlockSize={this.state.perPage}
            onGridReady={this.onGridReady}
            rowHeight={60}
            defaultColDef={{ flex: 1 }}
          >
            <AgGridColumn field="first_name" headerName="First Name" cellClass="vertical-middle" />
            <AgGridColumn field="last_name" headerName="Last Name" cellClass="vertical-middle" />
            <AgGridColumn field="email" headerName="Email" cellClass="vertical-middle" />
            <AgGridColumn field="avatar" headerName="Avatar" cellRendererFramework={this.avatarFormatter} cellClass="vertical-middle" />
          </AgGridReact>
        </div>
      </div>
    )
  }
}

export default AppClass;
