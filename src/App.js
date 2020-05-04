import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';


import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';


const particlesOptions = {
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          value_area: 800
        }
      }
  }
}

const app = new Clarifai.App({
  apiKey: '9496c9ba9f604efd908f1708c303f6b3'
 });

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedin: false
    }
  }


  calculateFaceLocation = (data) => {
   const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
   const image = document.getElementById('inputimage');
   const width = Number(image.width);
   const height = Number(image.height);
   console.log(width, height);
   return {
     leftCol: clarifaiFace.left_col * width,
     topRow: clarifaiFace.top_row * height,
     rightCol: width - (clarifaiFace.right_col * width),
     bottomRow: height - (clarifaiFace.bottom_row * height)
   }
  }


  displayFacebox = (box) => {
    this.setState({box: box})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input });
    //clarify api starts here
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL, 
        this.state.input)
      .then(response => this.displayFacebox(this.calculateFaceLocation(response))) 
      .catch(err => console.log(err));
      
    //clarify api ends here
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedin: false})
    } else if (route === 'home') {
      this.setState({isSignedin: true})
    }
    this.setState({route: route});
  }

  render(){
   const  { isSignedin, imageUrl, route, box } = this.state;
    return (
    <div className="App">
      <Particles className='particles' 
          params={particlesOptions}
      />
      <Navigation isSignedin = {isSignedin} onRouteChange = {this.onRouteChange} />
      
      { route === 'home' 
      ? <div> 
            <Logo /> 
            <Rank />
            <ImageLinkForm 
              onInputChange = {this.onInputChange} 
              onButtonSubmit = {this.onButtonSubmit}
            />
            <FaceRecognition box ={box} imageUrl={imageUrl} /> 
        </div>  
      : (
          route === 'signin' || route === 'signout'
          ? <Signin onRouteChange = {this.onRouteChange}/> 
          : <Register onRouteChange = {this.onRouteChange}/> 
        )
      }
      </div>
    );
  }
}

export default App;