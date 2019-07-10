import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ParticleField from 'react-particles-webgl';
import Clarifai from 'clarifai';


const app = new Clarifai.App({
  apiKey: '98d98fb7bd0549dd98ca99de8cc54114'
 });

const config = {
  showCube: false,
  dimension: '3D',
  boundaryType: 'passthru',
  velocity: 2,
  antialias: true,
  direction: {
    xMin: -0.6,
    xMax: 0.3,
    yMin: -1,
    yMax:-0.6,
    zMin: -0.6,
    zMax: 0.3
  },
  lines: {
    colorMode: 'rainbow',
    color: '#351CCB',
    transparency: 0.9,
    limitConnections: true,
    maxConnections: 20,
    minDistance: 150,
    visible: false
  },
  particles: {
    colorMode: 'solid',
    color: '#ffffff',
    transparency: 0.9,
    shape: 'circle',
    boundingBox:'canvas',
    count: 2500,
    minSize: 1,
    maxSize: 25,
    visible: true
  },
  cameraControls: {
    enabled: true,
    enableDamping: true,
    dampingFactor: 0.2,
    enableZoom: true,
    autoRotate: false,
    autoRotateSpeed: 0.3,
    resetCameraFlag: true
  }
};

class App extends Component {
  constructor(){
    super();
    this.state ={
      input: '',
      imageUrl:'',
      box:{},

    }
  }

  calculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height= Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width ,
      topRow: clarifaiFace.top_row * height ,
      rightCol: width- (clarifaiFace.rightCol * width) ,
      bottomRow: height - (clarifaiFace.bottomRow *height) ,
    }



  }

  displayFaceBox = (box) =>{
    this.setState({box:box});
}

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit =() =>{
    this.setState({imageUrl: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
      .then(response =>this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));

  }



  render(){
    return (
      <div className="App">

        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
        onInputChange={this.onInputChange} 
        onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>

        <ParticleField className='particles'
          params={config} 
        />
      </div>

    );
  }
}

export default App;
