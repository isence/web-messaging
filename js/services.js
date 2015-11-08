angular.module('mychat.services', ['firebase'])
    .factory("Auth", ["$firebaseAuth", "$rootScope",
    function ($firebaseAuth, $rootScope) {
            var ref = new Firebase(firebaseUrl);
        //下载数据到本地验证
            return $firebaseAuth(ref);
}])

.factory('Chats', function ($firebase, Rooms,$rootScope) {

    var selectedRoomId;

    var ref = new Firebase(firebaseUrl);
    var chats;

    return {
        all: function () {
            return chats;
        },
        remove: function (chat) {
            console.log(chat.from);
            if (chat.from===$rootScope.displayName.displayName){
                chats.$remove(chat).then(function (ref) {
                    ref.key() === chat.$id; // true item has been removed
                });
            }

        },
        get: function (chatId) {
            for (var i = 0; i < chats.length; i++) {
                if (chats[i].id === parseInt(chatId)) {
                    return chats[i];
                }
            }
            return null;
        },
        getSelectedRoomName: function () {
            var selectedRoom;
            if (selectedRoomId && selectedRoomId != null) {
                selectedRoom = Rooms.get(selectedRoomId);
                if (selectedRoom)
                    return selectedRoom.name;
                else
                    return null;
            } else
                return null;
        },
        selectRoom: function (roomId) {
            console.log("进入房间: " + roomId);
            selectedRoomId = roomId;
            if (!isNaN(roomId)) {
                chats = $firebase(ref.child('rooms').child(selectedRoomId).child('chats')).$asArray();
            }
        },
        send: function (from, message) {
            console.log("消息来自 :" + from.displayName + " & 消息是 " + message);
            if (from && message) {
                var chatMessage = {
                    from: from.displayName,
                    message: message,
                    createdAt: Firebase.ServerValue.TIMESTAMP
                };
                chats.$add(chatMessage).then(function (data) {
                    console.log("消息已经添加");
                });
            }
        }
    }
})

/**
 * 返回房间数组的服务
 */
.factory('Rooms', function ($firebase) {
    // Might use a resource here that returns a JSON array
    var ref = new Firebase(firebaseUrl);

    var rooms = $firebase(ref.child('rooms')).$asArray();
       // console.log(ref.child('rooms'));
    return {
        all: function () {
            return rooms;
        },
        get: function (roomId) {
            // Simple index lookup
            return rooms.$getRecord(roomId);
        }
    }
});