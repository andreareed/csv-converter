import React, { Component } from 'react';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import request from 'superagent';

class App extends Component {
  state = {
    error: null,
    preview: null,
    filename: null,
  };

  onDrop = files => {
    request
      .post('/api/convert')
      .attach('csvFile', files[0])
      .end((error, response) => {
        if (error) {
          this.setState({ error });
        } else {
          this.setState({
            filename: response.body.filename,
            preview: <pre>{JSON.stringify(response.body.preview, null, 2)}</pre>,
          });
        }
      });
  };

  render() {
    return (
      <div className="wrapper">
        <h1>CSV To JSON</h1>
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
            <a href={`downloads/${this.state.filename}.json`} download>
              » Download «
            </a>
            <h3>Preview</h3>
            {this.state.preview}
          </div>
        )}
      </div>
    );
  }
}

export default App;
