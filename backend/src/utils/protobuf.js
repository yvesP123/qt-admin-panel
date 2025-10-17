const protobuf = require('protobufjs');
const path = require('path');

let UserProto, UserListProto;

async function loadProto() {
  const root = await protobuf.load(path.join(__dirname, '../proto/user.proto'));
  UserProto = root.lookupType('User');
  UserListProto = root.lookupType('UserList');
}

loadProto();

function encodeUsers(users) {
  const message = UserListProto.create({ users });
  return UserListProto.encode(message).finish();
}

module.exports = {
  encodeUsers
};