const PROTO_USER_PATH = __dirname + '/proto/user.proto';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const _ = require('lodash');

let userPackageDefinition = protoLoader.loadSync(
    PROTO_USER_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
let user_proto = grpc.loadPackageDefinition(userPackageDefinition).user;

let { users } = require('./user-data.js');

function getUserDetails(call, callback) {
    callback(null,
        {
            message: _.find(users, { id: call.request.id })
        });
}

function main() {
    let server = new grpc.Server();
    server.addService(user_proto.User.service, { getUserDetails: getUserDetails });
    server.bind('0.0.0.0:4500', grpc.ServerCredentials.createInsecure());
    server.start();
    console.log("server started")
}

main();