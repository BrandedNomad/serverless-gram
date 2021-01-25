const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();

const groupsTable = process.env.GROUPS_TABLE
const imagesTable = process.env.IMAGES_TABLE

module.exports.handler = async (event)=>{
    console.log('Processing event: ', event)

    const groupId = event.pathParameters.groupId

    const validGroupId = await groupExists(groupId)

    if(!validGroupId){
        return {
            statusCode: 404,
            headers: {
                "Access-Control-Allow-Origin":"*"
            },
            body: JSON.stringify({
                error:'Group does not exist'
            })
        }
    }

    const images = await getImagesPerGroup(groupId)

    return {
        statusCode: 201,
        headers:{
            'Access-Control-Allow-Origin':'*'
        },
        body: JSON.stringify({
            items: []
        })
    }
}

async function getImagesPerGroup(groupId){
    const result = await docClient.query({
        TableName: imagesTable,
        KeyConditionExpression:'groupId = :groupId',
        ExpressionAttributeValues:{
            ':groupId': groupId
        },
        ScanIndexForward: false
    }).promise()
}

async function groupExists(groupId){
    const result = await docClient.get({
        TableName: groupsTable,
        Key: {
            id: groupId
        }
    }).promise()

    console.log('Get group: ', result)
    return !!result.Item
}
