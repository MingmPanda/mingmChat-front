document.write("<script type='text/javascript' src='app.js'></script>"); 

window.CHAT = {
	socket: null,
	init: function() {
		if (window.WebSocket) {
			
			// 如果当前的状态已经连接，那就不需要重复初始化websocket
			if (CHAT.socket != null 
				&& CHAT.socket != undefined 
				&& CHAT.socket.readyState == WebSocket.OPEN) {
				return false;
			}
				
			CHAT.socket = new WebSocket(app.nettyServerUrl);
			CHAT.socket.onopen = CHAT.wsopen,
			CHAT.socket.onclose = CHAT.wsclose,
			CHAT.socket.onerror = CHAT.wserror,
			CHAT.socket.onmessage = CHAT.wsmessage;
		} else {
			alert("手机设备过旧，请升级手机设备...");
		}
	},
	chat: function(msg) {
		// 如果当前websocket的状态是已打开，则直接发送， 否则重连
		if (CHAT.socket != null 
				&& CHAT.socket != undefined  
				&& CHAT.socket.readyState == WebSocket.OPEN) {
				CHAT.socket.send(msg);
		} else {
			// 重连websocket
			CHAT.init();
			setTimeout("CHAT.reChat('" + msg + "')", "1000");
		}
	},
	reChat: function(msg) {
		console.log("消息重新发送...");
		CHAT.socket.send(msg);
	},
	wsopen: function() {
		console.log("websocket连接已建立...");
		
		var me = app.getUserGlobalInfo();
		// 构建ChatMsg
		var chatMsg = new app.ChatMsg(me.id, null, null, null);
		// 构建DataContent
		var dataContent = new app.DataContent(app.CONNECT, chatMsg, null);
		// 发送websocket
		CHAT.chat(JSON.stringify(dataContent));
	},
	wsmessage: function(e) {
		console.log("接受到消息：" + e.data);
		
					// 转换DataContent为对象
					var dataContent = JSON.parse(e.data);
					var action = dataContent.action;
					if (action === app.PULL_FRIEND) {
						CHAT.fetchContactList();
						return false;						
					}
					
					// 如果不是重新拉取好友列表，则获取聊天消息模型，渲染接收到的聊天记录
					var chatMsg = dataContent.chatMsg;
					var msg = chatMsg.msg;
					var friendUserId = chatMsg.senderId;
					var myId = chatMsg.receiverId;
					
					// 调用聊天webview的receiveMsg方法
//					var chatWebview = plus.webview.getWebviewById("chatting-180718GA2ZM9N5S8");
					var chatWebview = plus.webview.getWebviewById("chatting-" + friendUserId);
					var isRead = true;	// 设置消息的默认状态为已读
					if (chatWebview != null) {
						chatWebview.evalJS("receiveMsg('" + msg + "')");
						chatWebview.evalJS("resizeScreen()");
					} else {
						isRead = false;	// chatWebview 聊天页面没有打开，标记消息未读状态
					}
					
					// 接受到消息之后，对消息记录进行签收
					var dataContentSign = new app.DataContent(app.SIGNED, null, chatMsg.msgId);
					CHAT.chat(JSON.stringify(dataContentSign));
	},
	wsclose: function() {
		console.log("连接关闭...");
	},
	wserror: function() {
		console.log("发生错误...");
	},
	// 获取后端所有好友列表
	fetchContactList: function() {
		var user = app.getUserGlobalInfo();
		mui.ajax(app.serverUrl + "/u/myFriends?userId=" + user.id,{
			data:{},
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			headers:{'Content-Type':'application/json'},	              
			success:function(data){
				
				if (data.status == 200) {
					var contactList = data.data;
					app.setContactList(contactList);
				}
			}
		});
	}
};
