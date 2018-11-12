window.app = {
	
	/**
	 * 后端服务发布的url地址
	 */
	serverUrl: 'http://192.168.65.140:8080',
	
	/**
	 * 图片服务器的url地址
	 */
	imgServerUrl: 'http://192.168.72.208:88/mingm/',
	
	/**
	 * 判断字符串是否为空
	 * @param {Object} str
	 * true：不为空
	 * false：为空
	 */
	isNotNull: function(str) {
		if (str != null && str != "" && str != undefined) {
			return true;
		}
		return false;
	},
	
	/**
	 * 封装消息提示框，默认mui的不支持居中和自定义icon，所以使用h5+
	 * @param {Object} msg
	 * @param {Object} type
	 */
	showToast: function(msg, type) {
		plus.nativeUI.toast(msg, 
			{icon: "image/" + type + ".png", verticalAlign: "center"})
	},
	
	/**
	 * 保存用户的全局对象
	 * @param {Object} user
	 */
	setUserGlobalInfo: function(user) {
		var userInfoStr = JSON.stringify(user);
		plus.storage.setItem("userInfo", userInfoStr);
	},
	
	/**
	 * 获取用户的全局对象
	 */
	getUserGlobalInfo: function() {
		var userInfoStr = plus.storage.getItem("userInfo");
		return JSON.parse(userInfoStr);
	},
	
	/**
	 * 登出后，移除用户全局对象和联系好友
	 */
	userLogout: function() {
		plus.storage.removeItem("userInfo");
		plus.storage.removeItem("contactList");

	},
	
	/**
	 * 用于登出再登录刷新
	 */
	reloadWebview: function() {
		if(plus.webview.getWebviewById("mingm-chatlist.html")) {
			plus.webview.getWebviewById("mingm-chatlist.html").reload();
			plus.webview.getWebviewById("mingm-contact.html").reload();
			plus.webview.getWebviewById("mingm-discover.html").reload();
			plus.webview.getWebviewById("mingm-me.html").reload();
		}

		
	},
	
	/**
	 * 保存用户的联系人列表
	 * @param {Object} contactList
	 */
	setContactList: function(contactList) {
		var contactListStr = JSON.stringify(contactList);
		plus.storage.setItem("contactList", contactListStr);
	},
	
	/**
	 * 获取本地缓存中的联系人列表
	 */
	getContactList: function() {
		var contactListStr = plus.storage.getItem("contactList");
		
		if (!this.isNotNull(contactListStr)) {
			return [];
		}
		
		return JSON.parse(contactListStr);
	}
}
