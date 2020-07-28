const PROTO_USER_PATH = __dirname + '/proto/user.proto';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const _ = require('lodash')

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

let { orders } = require('./order-data.js');

function main() {
    let client = new user_proto.User('localhost:4500',
        grpc.credentials.createInsecure());
    let orderId;
    if (process.argv.length >= 3) {
        orderId = parseInt(process.argv[2]);
    } else {
        orderId = 1;
    }
    console.log(orderId)
    const curOrder = _.find(orders, {id: orderId})
    if (curOrder){
        client.getUserDetails({ id: curOrder.userid }, function (err, response) {
            curOrder.OrderPerson = response.message
            console.log('Order number:', orderId, '\n', curOrder);
        });
    }else{
        console.log('bad Noy found no order')
    }
}

main();