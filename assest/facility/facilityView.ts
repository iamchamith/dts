module FacilityView {

    $(function () {
        init.initControlles();
        crud.read();
    });

    var init = {

        initControlles: function () {

            $('#grid').kendoGrid({
                columns: [
                    { field: "FacilityId", title: "FacilityId", hidden: true },
                    { field: "Name", title: "Name" },
                    { field: "FacilityType", title: "Facility Type" },
                    { field: "FacilityManeger", title: "Maneger" },
                    { field: "Seating", title: "Seating" },
                    { field: "Standing", title: "Standing" },
                    { field: "Active", title: "Active" },
                    {
                        command: [
                            {
                                name: "Edit",
                                click: function (e) {
                                    
                                }
                            },
                            { name: "X" } // built-in "destroy" command
                        ]
                    }
                ],
                pageable: {
                    pageSize: 20
                },
                toolbar: [{
                    text: "Go to Add User Page" 
                }]
            });

            $(".myCustomClass").click(function () {
                alert("Click!");
            });
        }
    }

    var crud = {

        read: function () {

            new apiConnection().callservice('/Facilities/ManegeFacilities/GetFacilitiInfo', null).done(function (e) {

                $('#grid').data("kendoGrid").setDataSource(new kendo.data.DataSource({ data: e.data }));
            });
        }
    }

    class apiConnection extends JTypeScipt.apiConnector { }
}