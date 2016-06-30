module CustomerUpdate {


    $(function () {

        init.initControlles();
        lookups.loadLookups("");
         
    });


    var init = {
        
        initControlles: function () {
 
        }
    }

    var lookups = {

        loadLookups: function (url:string) {

            new ServerConnector().callservice(url, null).done(function (e) {

                kendo.bind('',e.content);

            });
        },

    };

    var customerCrud = {

        loadCustomer: function (url: string) {

            new ServerConnector().callservice(url, null).done(function (e) {

                kendo.bind('', e.content);

            });
        },

        updateCustomer: function (url:string){

            new ServerConnector().callservice(url, null).done(function (e) {

                alert(JSON.stringify(e));

            });
        }
    };


    class ServerConnector extends JTypeScipt.apiConnector{ }
}