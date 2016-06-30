/// <reference path="../../comman.ts" />
 
module Dashboard{

    const  CustomerInfoUrl = "/Mainnavigation/home/GetCustomerInfo";
    const lookupInfoUrl = "/Mainnavigation/home/Lookup";
    const newsUrl = "/Mainnavigation/home/GetNews";
    $(function () {

        LoadControllers();
        serviceConnector.getLookups();
        serviceConnector.getuserDashboardInfo();
        serviceConnector.getNews({ State: 0, Index: 0 });
    });

    function LoadControllers() {

        $("#ddState").kendoDropDownList({ dataTextField: "Text", dataValueField: "Value", select: function (e) { Events.ddStateSelect(e) } });

    }

    var Events = {
         
        ddStateSelect(e) {
            serviceConnector.getNews({ State: $("#ddState").data("kendoDropDownList").value(), Index: 0 });
        }
    }

    var serviceConnector = {

        getuserDashboardInfo: function () {


            new ServiceConnector().callservice(CustomerInfoUrl, null)
                .done(function (data) {

                    console.log(data);

                    kendo.bind($("#div_customer_info"), data.customer);


                }).fail(function () {
                    console.log('error');
                });
        },
        getLookups: function () {
            new ServiceConnector().callservice(lookupInfoUrl, null)
                .done(function (data) {

                    console.log(data);
                    $("#ddState").data("kendoDropDownList").setDataSource(new kendo.data.DataSource({
                        data: data.status
                    }));

                }).fail(function () {
                    console.log('error');
                });

        },
        getNews: function (e) {

            new ServiceConnector().callservice(newsUrl, e)
                .done(function (data) {

                    console.log(data);

                    $("#newsList").kendoListView({
                        dataSource: data.news,
                        template: kendo.template($("#newsListTemplate").html())
                    });


                }).fail(function () {
                    console.log('error');
                });
        }
    }
 
     
    class ServiceConnector extends JTypeScipt.apiConnector {}

}