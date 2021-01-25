
const AWS = require('aws-sdk');
const {v4:uuidv4} = require('uuid');

const docClient = new AWS.DynamoDB.DocumentClient()
const groupTable = process.env.GROUPS_TABLE;

exports.handler = async (event)=>{
    console.log('Processing event: ', event);
    const itemId = uuidv4();
    const parsedBody = JSON.parse(event.body);
    const newItem = {
        id: itemId,
        ...parsedBody
    }

    await docClient.put({
        TableName: groupTable,
        Item: newItem
    }).promise()

    return {
        statusCode: 201,
        headers:{
            "Access-Control-Allow-Origin":"*",
        },
        body:JSON.stringify({
            newItem
        })
    }
}
