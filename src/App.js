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
    const file = files[0];

    if (!file) {
      this.setState({ error: 'Invalid File Type' });
      return;
    }

    if (files.length > 1) {
      this.setState({ error: 'Please upload only 1 file at a time' });
      return;
    }

    this.setState({ error: null });

    request
      .post('/api/convert')
      .attach('csvFile', file)
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
                {isDragActive ? <p>Drop file here...</p> : <p>Drag and drop file here, or click to select a file.</p>}
              </div>
            );
          }}
        </Dropzone>
        {this.state.error && <div className="error">{this.state.error}</div>}
        {!this.state.preview && (
          <p>
            Upload your CSV file here to convert it to JSON. Once the upload is complete, you will be able to view a
            preview of the data and download the converted file if everything looks good!
          </p>
        )}
        {this.state.preview && (
          <div>
            <a href={`/static/downloads/${this.state.filename}.json`} download>
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
