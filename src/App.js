import React, { Component } from 'react';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import request from 'superagent';

class App extends Component {
  state = {
    error: null,
    preview: null,
  };

  onDrop = files => {
    request
      .post('/api/convert')
      .attach('csvFile', files[0])
      .end((error, response) => {
        if (error) {
          console.log(error);
          this.setState({ error });
        } else {
          this.setState({ preview: <pre>{JSON.stringify(response.body, null, '\t')}</pre> });
        }
      });
  };

  render() {
    return (
      <div className="wrapper">
        <h1>CSV Converter</h1>
        <Dropzone onDrop={this.onDrop} accept="text/csv, application/vnd.ms-excel">
          {({ getRootProps, getInputProps, isDragActive }) => {
            return (
              <div {...getRootProps()} className={classNames('dropzone', { 'dropzone--isActive': isDragActive })}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop files here...</p>
                ) : (
                  <p>Drag and drop files here, or click to select files to upload.</p>
                )}
              </div>
            );
          }}
        </Dropzone>
        {this.state.error}
        {this.state.preview && (
          <div>
            <h3>Preview</h3>
            {this.state.preview}
            <a href="download.json" download>
              Download
            </a>
          </div>
        )}
      </div>
    );
  }
}

export default App;
