var $url = "/settings/cloudConnect"

var data = utils.init({
  redirect: utils.getQueryString('redirect'),
  isConnect: false,
  iFrameUrl: '',
});

var methods = {
  btnConnectClick: function() {
    var $this = this;

    this.iFrameUrl = cloud.host + '/auth.html';
    this.isConnect = true;

    window.addEventListener(
      'message',
      function(e) {
        if (e.origin !== cloud.host) return;
        var userName = e.data.userName;
        var token = e.data.token;
        if (userName && token) {
          $this.apiSubmit(userName, token);
        }
      },
      false,
    );
  },

  apiGet: function() {
    var $this = this;

    utils.loading(this, true);
    $api.get($url).then(function (response) {
      var res = response.data;

      if (res.userName && res.token) {
        cloud.login(res.userName, res.token);
        location.href = $this.redirect;
      }
    }).catch(function (error) {
      utils.error(error);
    }).then(function () {
      utils.loading($this, false);
    });
  },

  apiSubmit: function(userName, token) {
    var $this = this;

    utils.loading(this, true);
    $api.post($url, {
      userName,
      token,
    }).then(function (response) {
      var res = response.data;
      if (!res.value) return;

      cloud.login(userName, token);
      location.href = $this.redirect;
    }).catch(function (error) {
      utils.error(error);
    }).then(function () {
      utils.loading($this, false);
    });
  },
};

var $vue = new Vue({
  el: "#main",
  data: data,
  methods: methods,
  created: function () {
    // if (!$cloudToken || !$cloudUserName) {
    //   this.apiGet();
    // } else {
      utils.loading(this, false);
    // }
  }
});