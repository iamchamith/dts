var JTypeScipt;
(function (JTypeScipt) {
    $(document).ready(function () {
    });
    var form = (function () {
        function form() {
        }
        form.prototype.bindValues = function (val) {
            var f = new form();
            new apiConnector().callservice('/TTT/GetPosts', { begin: val })
                .done(function (data) {
                console.log(data);
            }).fail(function () {
                console.log('error');
            });
        };
        return form;
    }());
    JTypeScipt.form = form;
    var apiConnector = (function () {
        function apiConnector() {
        }
        apiConnector.prototype.callservice = function (url, data) {
            var dfd = jQuery.Deferred();
            $.ajax({
                url: url,
                method: "GET",
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                cache: false,
                success: function (e) {
                    var value = e;
                    dfd.resolve(value);
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(textStatus);
                    dfd.reject();
                }
            });
            return dfd;
        };
        apiConnector.prototype.callservicePost = function (url, data) {
            var dfd = jQuery.Deferred();
            $.ajax({
                url: url,
                method: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(data),
                dataType: "json",
                cache: false,
                success: function (e) {
                    var value = e;
                    dfd.resolve(value);
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(textStatus);
                    dfd.reject();
                }
            });
            return dfd;
        };
        return apiConnector;
    }());
    JTypeScipt.apiConnector = apiConnector;
    (function (EMessageType) {
        EMessageType[EMessageType["success"] = 0] = "success";
        EMessageType[EMessageType["error"] = 1] = "error";
        EMessageType[EMessageType["warning"] = 2] = "warning";
    })(JTypeScipt.EMessageType || (JTypeScipt.EMessageType = {}));
    var EMessageType = JTypeScipt.EMessageType;
    var messages = (function () {
        function messages() {
        }
        messages.prototype.getMessageType = function (msgType) {
            var message = "success";
            switch (msgType) {
                case EMessageType.success:
                    message = "success";
                    break;
                case EMessageType.error:
                    message = "error";
                    break;
                case EMessageType.warning:
                    message = "warning";
                    break;
            }
            return message;
        };
        messages.prototype.basicMessage = function (text) {
            swal(text);
        };
        messages.prototype.okMessage = function (title, text) {
            if (title === void 0) { title = "success"; }
            if (text === void 0) { text = ""; }
            swal(title, text);
        };
        messages.prototype.messages = function (title, text, type) {
            swal(title, text, this.getMessageType(type));
        };
        messages.prototype.successMessage = function (title, text) {
            if (title === void 0) { title = "Success"; }
            if (text === void 0) { text = ""; }
            swal(title, text, "success");
        };
        messages.prototype.timeMessage = function (title, text, timer) {
            if (title === void 0) { title = "success"; }
            if (text === void 0) { text = ""; }
            if (timer === void 0) { timer = 2000; }
            swal({ title: title, text: text, timer: timer, showConfirmButton: false });
        };
        messages.prototype.errorMessage = function (title, text) {
            if (title === void 0) { title = "error"; }
            if (text === void 0) { text = ""; }
            sweetAlert(title, text);
        };
        messages.prototype.confirmMessage = function (title, text, confirmButtonText, cancelButtonText, type) {
            if (title === void 0) { title = "are you sure"; }
            if (text === void 0) { text = ""; }
            if (confirmButtonText === void 0) { confirmButtonText = "Yes"; }
            if (cancelButtonText === void 0) { cancelButtonText = "No"; }
            swal({
                title: title,
                text: text,
                type: this.getMessageType(type),
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: confirmButtonText,
                cancelButtonText: cancelButtonText,
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
                if (isConfirm) {
                    return true;
                }
                else {
                    return false;
                }
            });
        };
        return messages;
    }());
    JTypeScipt.messages = messages;
    var googleMap = (function () {
        function googleMap() {
        }
        googleMap.prototype.initGoogleMap = function (lat, lan, info, elementId, mapType) {
            if (mapType === void 0) { mapType = google.maps.MapTypeId.ROADMAP; }
            var prop = {
                center: new google.maps.LatLng(lat, lan),
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                panControl: false,
                zoomControl: true,
                scrollwheel: false,
                mapTypeControl: true,
                scaleControl: true,
                streetViewControl: true,
                overviewMapControl: false
            };
            var marker = new google.maps.Marker({
                position: prop.center,
                animation: google.maps.Animation.DROP
            });
            var map = new google.maps.Map($('#' + Location)[0], prop);
            marker.setMap(map);
            var infowindow = new google.maps.InfoWindow({
                content: info
            });
            google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
                infowindow.open(map, marker);
            });
        };
        return googleMap;
    }());
    JTypeScipt.googleMap = googleMap;
})(JTypeScipt || (JTypeScipt = {}));
//# sourceMappingURL=comman.js.map