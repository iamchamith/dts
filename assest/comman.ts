module JTypeScipt {

    $(document).ready(function () {


    });

    export class form {

        bindValues(val) {
            var f = new form();
            new apiConnector().callservice('/TTT/GetPosts', { begin: val })
                .done(function (data) {

                    console.log(data);

                }).fail(function () {
                    console.log('error');
                });
        }
    }

    export class apiConnector {

        callservice(url: string, data: any): JQueryDeferred<any> {
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
        }

        callservicePost(url: string, data: any): JQueryDeferred<any> {
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
        }
    }

    export enum EMessageType {

        success = 0,
        error = 1,
        warning = 2

    }

    export class messages {

        getMessageType(msgType: EMessageType) {

            let message = "success";
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
        }

        basicMessage(text: string) {
            swal(text);
        }

        okMessage(title: string = "success", text: string = "") {
            swal(title, text);
        }

        messages(title: string, text: string, type: EMessageType) {
            swal(title, text, this.getMessageType(type));
        }

        successMessage(title: string = "Success", text: string = "") {
            swal(title, text, "success");
        }

        timeMessage(title: string = "success", text: string = "", timer: number = 2000) {
            swal({ title: title, text: text, timer: timer, showConfirmButton: false });
        }
        errorMessage(title: string = "error", text: string = "") {
            sweetAlert(title, text);
        }

        confirmMessage(title: string = "are you sure", text: string = "", confirmButtonText: string = "Yes", cancelButtonText: string = "No", type: EMessageType) {

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
                if (isConfirm) { return true; }
                else { return false; }
            });
        }
    }

    export class googleMap {

        initGoogleMap(lat: number, lan: number, info: string, elementId: string, mapType: google.maps.MapTypeId = google.maps.MapTypeId.ROADMAP) {

            const prop = {
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
            var map = new google.maps.Map(<HTMLInputElement>$('#' + Location)[0], prop);
            marker.setMap(map);

            var infowindow = new google.maps.InfoWindow({
                content: info
            });

            google.maps.event.addListenerOnce(map, 'tilesloaded', () => {
                infowindow.open(map, marker);
            });
        }
    }
}