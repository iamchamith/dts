module FacilitySetup {


    $(function () {

        init.initControlles();
        init.initLookups();
        crud.read();
    });

    var init = {

        initControlles: function () {

            $('#txtOparatingStartTime').kendoTimePicker();
            $('#txtOparatingEndTime').kendoTimePicker();
            $('#txtSeatingCapacity').kendoNumericTextBox({ min: 1, max:10000 });
            $('#txtStandingCapacity').kendoNumericTextBox({ min: 0, max: 10000 });
            $('#txtBumpInTime').kendoNumericTextBox({ min: 0, max: 1000 });
            $('#txtBumpOutTime').kendoNumericTextBox({ min: 0, max: 1000 });

            $('#ddFacilityManeger').kendoComboBox({ dataValueField: "value", dataTextField: "text" });
            $('#ddVenue').kendoComboBox({ dataValueField: "value", dataTextField: "text" });
            $('#ddFacilityType').kendoComboBox({ dataValueField: "value", dataTextField: "text" });
            $('#ddFacilityCategory').kendoComboBox({ dataValueField: "value", dataTextField: "text" });

            $('#txtDeposite').kendoNumericTextBox({ min: 0, max: 1000 });
            $('#txtDailyRate').kendoNumericTextBox({ min: 0, max: 1000 });
            $('#txtHourlyRate').kendoNumericTextBox({ min: 0, max: 1000 });
            $('#ddMeasurement').kendoComboBox({ dataValueField: "value", dataTextField: "text" });
            $('#txtLength').kendoNumericTextBox({ min: 0, max: 1000 });
            $('#txtWidth').kendoNumericTextBox({ min: 0, max: 1000 });
            $('#txtHeight').kendoNumericTextBox({ min: 0, max: 1000 });
            $("#txtColorCode").kendoColorPicker({ toolIcon: "k-foreColor" });

            $('#txtTemsAndCondition').kendoEditor();
            $('#txtDiscription').kendoEditor();
            $('#img').kendoUpload();
        },
        initLookups: function () {

            new apiConnection().callservice('/Facilities/ManegeFacilities/FacilitySetupLooksup', null)
                .done(function (e) {
                    $('#ddFacilityManeger').data('kendoComboBox').setDataSource(new kendo.data.DataSource({ data: e.manegers }));
                    $('#ddVenue').data('kendoComboBox').setDataSource(new kendo.data.DataSource({ data: e.venue  }));
                    $('#ddFacilityType').data('kendoComboBox').setDataSource(new kendo.data.DataSource({ data: e.facilityType  }));
                    $('#ddFacilityCategory').data('kendoComboBox').setDataSource(new kendo.data.DataSource({ data: e.facilityCategory }));
                    $('#ddMeasurement').data('kendoComboBox').setDataSource(new kendo.data.DataSource({ data: e.unitOfMessurement }));
            });
        } 
    }

    var crud = {

        read: function () {

            new apiConnection().callservice('/Facilities/ManegeFacilities/GetInfo', null).done(function (e) {

                $('#txtName').val(e.name);
                $('#isActive').prop('checked', e.isActive);
                $('#txtDiscription').data("kendoEditor").value(e.dis);
                $('#txtOparatingStartTime').data("kendoTimePicker").value(e.oparatingStartTime);
                $('#txtOparatingEndTime').data("kendoTimePicker").value(e.oparatingStartTime);
                $('#txtSeatingCapacity').data('kendoNumericTextBox').value(e.seatingCapacity);
                $('#txtStandingCapacity').data('kendoNumericTextBox').value(e.standingCapacity);
                $('#txtBumpInTime').data('kendoNumericTextBox').value(e.bumpInTime);
                $('#txtBumpOutTime').data('kendoNumericTextBox').value(e.bumpInTime);
                $('#ddFacilityManeger').data("kendoComboBox").value(e.facilityManager);
                $('#ddVenue').data("kendoComboBox").value(e.venue);
                $('#ddFacilityType').data("kendoComboBox").value(e.facilityType);
                $('#ddFacilityCategory').data("kendoComboBox").value(e.facilitycategory);
                $('#txtDeposite').data('kendoNumericTextBox').value(e.deposit);
                $('#txtDailyRate').data('kendoNumericTextBox').value(e.dailyRate);
                $('#txtHourlyRate').data('kendoNumericTextBox').value(e.hourlyRate);
                $('#txtAddress1').val(e.address1);
                $('#txtAddress2').val(e.address2);
                $('#City').val(e.city);
                $('#txtPostalCode').val(e.postCode);
                $('#txtSate').val(e.state);
                $('#txtCountry').val(e.country);
                $('#txtFacilityUrl').val(e.facilityUrl);
                $('#txtFacilityEmail').val(e.facilityEmail);

                $('#ddMeasurement').data("kendoComboBox").value(e.measurement);
                $('#txtLength').data("kendoNumericTextBox").value(e.length);
                $('#txtWidth').data("kendoNumericTextBox").value(e.Width);
                $('#txtHeight').data("kendoNumericTextBox").value(e.Height);
                $('#txtPhoneNo').val(e.phoneNo);
                $('#txtMobileNo').val(e.mobileNo);
                $('#txtTemsAndCondition').data('kendoEditor').value(e.terms);
                $('#imgg').attr('src', e.image);
                //$('#colorpicker').data("kendoColorPicker").value(e.color);

                new JTypeScipt.googleMap().initGoogleMap(e.coodinate[0], e.coodinate[1], e.name, 'map');
            });
        }
    }


    class apiConnection extends JTypeScipt.apiConnector { }
}