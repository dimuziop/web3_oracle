import {createRef, Component, useRef} from "react";
import web3 from "./web3";
import {create} from "ipfs-http-client";

require('dotenv').config()

const TOKEN = process.env.JWT;

export default class FileUpload extends Component {

    state = {file: ""}

    constructor(props) {
        super(props);
        this.fieldForm = createRef();
        this.ipfsClient = create(
            {
                host: "ipfs.infura.io",
                protocol: "https",
                port: 5001,
                headers: {

                }

    });
    }


    onSubmit = async (event) => {
        event.preventDefault();
        const {cid} = await this.ipfsClient.add('{"aJson": "this is a json"}', {
            //onlyHash: true,
            cidVersion: 1,
        })
        console.log(cid.toString())
        this.fieldForm.current.value = "";
        //this.setState({file: event.target.files[0]})

    }

    onFileInputChange = (event) => {
        console.log(event.target.files);
        this.setState({file: event.target.files[0]})
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <h4>Upload an IPFS file</h4>
                <div>
                    <label>File Name</label>
                    <input
                        ref={this.fieldForm}
                        type="file"
                        multiple={true}
                        onChange={this.onFileInputChange}
                    />
                </div>
                <button>Enter</button>
            </form>
        )
    }


}
