import 'font-awesome/css/font-awesome.css'
import React from 'react';
import './App.css';
import _ from "underscore";
import InfiniteScroll from "./InfiniteScroll.js"
import {Form, FormControl, ControlLabel} from "react-bootstrap";



class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = Object.create(null,{})
  }
  componentWillMount(){
    this.getInitialState()
  }

  getInitialState(props){
    this.state = Object.create(null,{})
    this.setState({
      width:'',
      height:'',
      order_by:''
    })
  }

  //  diff whether the comeponent and its children(in this case the
  //  InfiniteScroll component) should be update and receive the new state 
  componentWillUpdate(nextProps, nextState){
    return !_.isEqual(nextState, this.state)
  }

  // handler for resetting the state of the component when any queries fields's
  // value is changed(e.g: width, height, sort by)
  _handleChange= (key)=>(e)=>{
                            let state = {};
                            state[key] = e.target.value;
                            this.setState(state);
                          }
  render(){
    return (
      <div className="App">
        <br/>
        <div>
          <Form inline>
            <FormControl
                  placeholder={"Width"}
                  value={this.state.width}
                  onChange={this._handleChange('width')} />
            <FormControl
                  placeholder={"Height"}
                  value={this.state.height}
                  onChange={this._handleChange('height')}/>

                <ControlLabel>Sort by</ControlLabel>
            <FormControl componentClass="select"
                          onChange={this._handleChange('order_by')}>
              <option value={"latest"}>Latest</option>
              <option value={"oldest"}> Oldest</option>
              <option value={"popular"}> Popular </option>
            </FormControl>
          </Form>
        </div>
        <br/>
        <div>
          <InfiniteScroll data={this.state}/>
        </div>
    </div>
    );
  }
}

export default App;
