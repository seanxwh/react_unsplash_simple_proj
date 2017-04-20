import React from 'react';
import Waypoint from 'react-waypoint';
import Unsplash, { toJson } from "unsplash-js";
import _ from "underscore";
import {Table, ListGroup, ListGroupItem} from "react-bootstrap";

// Unsplash initialization function
const unsplash = new Unsplash({
  applicationId: "",
  secret: "",
  callbackUrl: "urn:ietf:wg:oauth:2.0:oob"
});




// json is an array of image jsons from the response
let loadImgInfoFromJson = (json)=>json.map((obj)=>{
                                            return{
                                              img_id: obj.id,
                                              sm_img: obj.urls.small,
                                              rg_link: obj.urls.regular,
                                              user: obj.user.username,
                                              height: obj.height,
                                              width: obj.width
                                            }
                                          })

let arraysConcat = (ary1, ary2)=> ary1.concat(ary2)



// the InfiniteScroll Component
export default class InfiniteScroll extends React.Component{

  constructor(props) {
    super(props)
    this.state = Object.create(null,{})
  }

  componentWillMount(){
    this.getInitialState()
  }

  // diff the current and next parent properties(e.g: width, hight, sort_by),
  //  re-initialize the component if any of the properties changed
  componentWillReceiveProps (nextProps) {
    if (_.isEqual(nextProps.data, this.props.data)===false){
      this.getInitialState(nextProps)
    }
  }

  //  used for re-initialize the component
  getInitialState(props) {
    this.state = Object.create(null,{})
    this.setState({
      items : [],
      isLoading:true
    })
    let data = !props?{}:props.data
    data.count = 5
    this._handleAjaxCall(data);
  }

  //get more items if user reach to the page end
  _loadMoreItems =()=>{
    let props = this.props
    this.setState({
      isLoading: true
    })
    let data = !props?{}:props.data
    data.count = 5
    this._handleAjaxCall(data);
  }

  //  handling adjax call to Unsplash API
  _handleAjaxCall =(arg)=>{
    let min_height = !!arg.height? arg.height:0
    let min_width = !!arg.width? arg.width:0

    unsplash.photos.getRandomPhoto(arg)
      .then(toJson)
        .then(json => {
          // the following two filtering step are necessary due to the result
          // come back from Unsplash 'getRandomPhoto' have inconsistance result


          // select fields of interest from the returning result
          let result = loadImgInfoFromJson(json)
          // filter the returning result  objects that match the
          // argument requirements
          let filterd_result = result.filter((imgInfo)=>{
                                              return !!(imgInfo.height>=min_height
                                                  && imgInfo.width>=min_width)
                                            })

          // filter the objects within current state that
          // match the argument requirements
          let prev_itms = this.state.items
          let filterd_prev_itms = prev_itms.filter((imgInfo)=>{
                                              return !!(imgInfo.height>=min_height
                                                  && imgInfo.width>=min_width)
                                            })

          let newAry = arraysConcat(filterd_prev_itms, filterd_result)
          // update the new state
          this.setState({
            items: newAry,
            isLoading: false,
          })
        })
    }

  // return the image and its info(table) in a group maner
  _renderImgAndInfo() {
    return this.state.items.map(function(imageObjs, index) {
      let {id, sm_img, rg_link, user, height, width} = imageObjs
      let orientation = height>width? "Portrait":"Landscape"
      return (
        <ListGroupItem className="show-grid infinite-scroll-example__list-item"
                       key={index}>



            <ListGroup>


              <ListGroupItem>
                  <img src={sm_img} alt={id}/>
              </ListGroupItem>

              <ListGroupItem>
                <Table  striped bordered >
                  <thead >
                    <tr>
                      <th className="text-center">User Name</th>
                      <th className="text-center">Link</th>
                      <th className="text-center">Width</th>
                      <th className="text-center">Height</th>
                      <th className="text-center">Oreintation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{user}</td>
                      <td><a href={rg_link}>Image Link</a></td>
                      <td>{width}</td>
                      <td>{height}</td>
                      <td>{orientation}</td>
                    </tr>
                  </tbody>
                </Table>
              </ListGroupItem>


            </ListGroup>



        </ListGroupItem>
      );
    });
  }

  // return the additional image and its info once the filtered result come back
  _renderWaypoint= ()=>{
    if (!this.state.isLoading) {
      return (
        <Waypoint
          onEnter={this._loadMoreItems}
        />
      );
    }
  }

  render() {
    return (
      <div className="infinite-scroll-example">
          <div className="infinite-scroll-example__scrollable-parent">
            <ListGroup>
              {this._renderImgAndInfo()}
              <div className="infinite-scroll-example__waypoint">
                {this._renderWaypoint()}
              </div>
            </ListGroup>
            <div>
              <i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
            </div>
          </div>
      </div>
    );
  }
}
