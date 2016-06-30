var FacilitySetup;
(function (FacilitySetup) {
    $.validator.setDefaults({
        ignore: ''
    });
    jQuery.validator.addMethod("urlWithoutHttp", function (value, element) {
        var regexp = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
        return this.optional(element) || regexp.test(value);
    }, "Please enter a valid URL.");
    var util = {
        initSetupUpdateMode: function (e) {
            if (e == null)
                return;
            for (var i in e) {
                if (!e.hasOwnProperty(i))
                    return;
                var tag = $('[name="' + i.toCamelCase() + '"]');
                if (typeof tag.prop('tagName') === 'undefined')
                    continue;
                else {
                    var name = tag.prop('tagName').toLowerCase();
                    switch (name) {
                        case 'select':
                            var select = tag.data("kendoDropDownList");
                            select.select(function (val) {
                                return val.value == e[i];
                            });
                            break;
                        case 'input':
                            if (tag.is(':checkbox')) {
                                tag.prop('checked', e[i]);
                            } else if (tag.is(':text')) {
                                if (tag.is('input.k-input')) {
                                    if (typeof tag.data("kendoNumericTextBox") !== "undefined")
                                        tag.data("kendoNumericTextBox").value(e[i]);
                                    else if (typeof tag.data("kendoTimePicker") !== "undefined") {
                                        var picker = tag.data("kendoTimePicker");
                                        picker.value(moment.tz(e[i], this.getZone()).format('h:mm A'));
                                    }
                                } else if (tag.is('input.k-colorpicker')) {
                                    tag.data("kendoColorPicker").value(e[i]);
                                } else if (tag.is('input.k-textbox')) {
                                    tag.data("kendoMaskedTextBox").value(e[i]);
                                } else {
                                    tag.val(e[i]);
                                }
                            }
                            break;
                        case 'textarea':
                            var editor = tag.data("kendoEditor");
                            editor.value(e[i]);
                            break;
                        default:
                            break;
                    }
                }
            }
            if (e['facilityImage'].length !== 0) {
                $("<img>", {
                    "src": "data:image/png;base64," + e['facilityImage'],
                    "width": "100%",
                    "height": "350px"
                }).appendTo("#imagePreview");
            }
            $('#latitude').val(e["latitude"]);
            $('#longitude').val(e["longitude"]);
            this.googleMapInitialize(e["latitude"], e["longitude"]);
            $('.address-set').hide();
            $('#location2').show();
        },
        getZone: function () {
            if (typeof this.zone === "undefined") {
                this.zone = $('input[name="zoneInfo"]').val();
            }
            return this.zone;
        },
        saveForm: function (form, layout, exclusions, item, terms, notify) {
            $.ajax({
                url: '/admin/facility/save',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    infoViewModel: form,
                    configViewModel: layout,
                    exclusionsViewModels: exclusions,
                    itemViewModel: item,
                    termsViewmodel: terms,
                    readersViewModel: notify
                }),
                success: function (e) {
                    swal({
                        title: "Success!",
                        text: "Facility Create Succeeded!",
                        type: "success"
                    }, function () {
                        util.clearStorage();
                        $(location).attr('href', '/admin/facility/details');
                    });
                },
                error: function (e) {
                    swal({
                        title: "ERROR!",
                        text: "",
                        type: "error"
                    }, function () { });
                }
            });
        },
        updateForm: function (form, layout, exclusions, item, terms, notify) {
            $.ajax({
                url: '/admin/facility/updatefacility',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    infoViewModel: form,
                    configViewModel: layout,
                    exclusionsViewModels: exclusions,
                    itemViewModel: item,
                    termsViewmodel: terms,
                    readersViewModel: notify
                }),
                success: function (e) {
                    swal({
                        title: "Success!",
                        text: "Facility Update Succeeded!",
                        type: "success"
                    }, function () {
                        util.clearStorage();
                        $(location).attr('href', '/admin/facility/details');
                    });
                }
            });
        },
        googleMapInitialize: function (lat, lng) {
            setTimeout(function () {
                var mapProp = {
                    center: new google.maps.LatLng(lat, lng),
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
                    position: mapProp.center,
                    animation: google.maps.Animation.DROP
                });
                var map = new google.maps.Map($('.location-map')[0], mapProp);
                marker.setMap(map);
            }, 1000);
        },
        uuid: function () {
            var i, random;
            var uuid = '';
            for (i = 0; i < 32; i++) {
                random = Math.random() * 16 | 0;
                if (i === 8 || i === 12 || i === 16 || i === 20) {
                    uuid += '-';
                }
                uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
            }
            return uuid;
        },
        store: function (namespace, data) {
            if (arguments.length > 1) {
                localStorage.setItem(namespace, JSON.stringify(data));
                return data;
            } else {
                var store = localStorage.getItem(namespace);
                return (store && JSON.parse(store)) || [];
            }
        },
        clearStorage: function (namespace) {
            if (arguments.length === 0) {
                return localStorage.clear();
            } else {
                localStorage.removeItem(namespace);
            }
        }
    };
    var dynamicTerms = {
        init: function (e) {
            util.clearStorage('terms-facility');
            this.terms = arguments.length === 0 ? util.store('terms-facility') : util.store('terms-facility', e);
            this.template = kendo.template($('#dynamicTermItem').html());
            this.render();
            this.bindEvents();
        },
        bindEvents: function () {
            $('#btnAddDynamicTerms').on('click', this.createTerm.bind(this));
            $('#dynamic-list').on('change', '.toggle', this.toggle.bind(this)).on('dblclick', 'label', this.edit.bind(this)).on('keyup', '.edit', this.editKeyup.bind(this)).on('focusout', '.edit', this.update.bind(this)).on('click', '.destroy', this.destroy.bind(this));
        },
        getIndex: function (e) {
            var id = $(e).closest('li').data('id');
            var terms = this.terms;
            var i = terms.length;
            while (i--) {
                if (terms[i].id === id) {
                    return i;
                }
            }
            return -1;
        },
        render: function () {
            $('#dynamic-list').html(this.template(this.terms));
            $('#dynamic-item-new').focus();
            var terms = this.getTerms();
            util.store('terms-facility', terms);
        },
        toggle: function (e) {
            var i = this.getIndex(e.target);
            this.terms[i].isActive = !this.terms[i].isActive;
            this.render();
        },
        getTerms: function () {
            return this.terms;
        },
        createTerm: function (e) {
            var $input = $('#dynamic-item-new');
            var val = $input.val().trim();
            if (!val) {
                return;
            }
            this.terms.push({
                id: util.uuid(),
                term: val,
                isActive: true
            });
            $input.val('');
            this.render();
        },
        edit: function (e) {
            var $input = $(e.target).closest('li').addClass('editing').find('.edit');
            $input.val($input.val()).focus();
        },
        editKeyup: function (e) {
            if (e.which === 13) {
                e.target.blur();
            }
            if (e.which === 27) {
                $(e.target).data('abort', true).blur();
            }
        },
        update: function (e) {
            var $el = $(e.target);
            var val = $el.val().trim();
            if (!val) {
                this.destroy(e);
                return;
            }
            this.terms[this.getIndex(e.target)].term = val;
            this.render();
        },
        destroy: function (e) {
            var _this = this;
            swal({
                title: "Delete this term?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: true
            }, function () {
                _this.terms.splice(_this.getIndex(e.target), 1);
                _this.render();
            });
        }
    };
    var exclusionDate = {
        init: function (e) {
            this.exclusionDatesDataSource = new kendo.data.DataSource({
                data: [],
                schema: {
                    model: {
                        id: "uid"
                    }
                }
            });
            if (arguments.length !== 0) {
                this.setDateSource(e);
            }
            this.tmpl = kendo.template($('#tmplExclusionDates').html());
            this.render();
            this.bindEvents();
        },
        setDateSource: function (e) {
            $.each(e, function (i, d) {
                var zone = util.getZone();
                var from = moment.tz(d["occureFrom"], zone);
                var to = moment.tz(d["occureTo"], zone);
                d["occureFrom"] = Boolean(d["isFullDay"]) ? moment.tz(from.format('M/D/YYYY') + "11:00 AM", "M/D/YYYY h:mm A", util.getZone()).format() : from.format();
                d["occureTo"] = Boolean(d["isFullDay"]) ? moment.tz(to.format('M/D/YYYY') + "11:00 AM", "M/D/YYYY h:mm A", util.getZone()).format() : to.format();
                d["recurreFrom"] = moment.tz(d["recurreFrom"], zone).format("LT");
                d["recurreTo"] = moment.tz(d["recurreTo"], zone).format("LT");
                $.each(d["dates"], function (x, v) {
                    v["date"] = moment.tz(v["date"], zone).format();
                });
            });
            this.exclusionDatesDataSource.data(e);
        },
        getNoOfHours: function (from, to) {
            var fromDate = new Date(new Date().format("mm/dd/yyyy") + " " + from);
            var toDate = new Date(new Date().format("mm/dd/yyyy") + " " + to);
            var diff = toDate - fromDate;
            var hours = Math.ceil(1.0 * diff / 1000 / 60 / 60);
            return hours;
        },
        bindEvents: function () {
            $('#addExclusions').on('click', this.create.bind(this));
            $('#dateTableGrid thead').off('click', 'a[data-action="exdelete"]').on('click', 'a[data-action="exdelete"]', this.deleteExclusion.bind(this));
            $('input[name="isFullDay"]').on('click', this.toggleTime.bind(this));
            $('select#recurrentType').on('change', this.onRecuurentChange.bind(this));
            $("#ddl-weekdays").kendoMultiSelect({
                autoClose: false
            });
            $('form#frmExclusionDates').validate({
                rules: {
                    occureFrom: {
                        required: true
                    },
                    occureTo: {
                        required: true
                    },
                },
                messages: {
                    occureFrom: {
                        required: "* from date required"
                    },
                    occureTo: {
                        required: "* to date required"
                    },
                },
                errorElement: 'span',
                errorPlacement: function (error, element) {
                    $(element).closest("form").find("label[for='" + element.attr("id") + "']").append(error);
                }
            });
        },
        render: function () {
            var tbl = $('#dateTableGrid');
            tbl.empty();
            var ex = this.exclusionDatesDataSource.data();
            var template = this.tmpl;
            $('#dateTableGrid').html(kendo.render(template, ex));
            $('#dateTableGrid table thead tr:last-child .alterar').off('click').on('click', this.onExpandDates.bind(this));
            $('#dateTableGrid table thead tr:last-child .excluir').off('click').on('click', this.onDeleteDateSet.bind(this));
            $('#dateTableGrid table tbody tr > td:last-child .excluir').off('click').on('click', this.onDeleteDate.bind(this));
            $('#dateTableGrid table tbody tr > td:last-child .alterar').off('click').on('click', this.onDescriptioEdit.bind(this));
            $('#dateTableGrid table tbody tr').find('td:nth-child(2) > input[type=text]').on('keyup', this.onEnterUpdateDescription.bind(this));
        },
        onExpandDates: function (e) {
            $(e.target).closest('table').find('tbody').toggleClass('hidden');
        },
        onDescriptioEdit: function (e) {
            var tr = $(e.target).parents('tr');
            tr.find('td:nth-child(2) > span').addClass('hidden');
            tr.find('td:nth-child(2) > input[type=text]').removeClass('hidden').select();
            $(e.target).removeClass('fa-pencil-square-o').addClass('fa-floppy-o').off('click').on('click', this.updateDescription.bind(this));
        },
        updateDes: function (e) {
            var tr = $(e.target).parents('tr');
            var uid = tr.data('uid');
            var uuid = $(e.target).closest('table').find('thead>tr:first').data('uid');
            var input = tr.find('td:nth-child(2) > input[type=text]');
            var lbl = tr.find('td:nth-child(2) > span');
            lbl.text(input.val());
            lbl.removeClass('hidden');
            input.addClass('hidden');
            var data = this.exclusionDatesDataSource.get(uuid);
            var dates = data.get("dates");
            $.each(dates, function (i, v) {
                if (v["uid"] === uid)
                    v.set("description", input.val());
            });
        },
        updateDescription: function (e) {
            this.updateDes(e);
            $(e.target).removeClass('fa-floppy-o').addClass('fa-pencil-square-o').off('click').on('click', this.onDescriptioEdit.bind(this));
        },
        onEnterUpdateDescription: function (e) {
            if (e.which === 13) {
                this.updateDes(e);
                $(e.target).parent().next().find(':first-child').removeClass('fa-floppy-o').addClass('fa-pencil-square-o').off('click').on('click', this.onDescriptioEdit.bind(this));
            }
        },
        onDeleteDateSet: function (e) {
            var uid = $(e.target).closest('tr').data('uid');
            var data = this.exclusionDatesDataSource.get(uid);
            this.exclusionDatesDataSource.remove(data);
            $(e.target).closest('table').remove();
        },
        onDeleteDate: function (e) {
            var ele = $(e.target);
            var uid = ele.closest('tr').data('uid');
            var uuid = $(e.target).closest('table').find('thead>tr:first').data('uid');
            var data = this.exclusionDatesDataSource.get(uuid);
            var dates = data.get("dates");
            if (dates.length === 1) {
                this.exclusionDatesDataSource.remove(data);
                ele.closest('table').remove();
            } else {
                var d = $.grep(dates, function (c, i) {
                    return c["uid"] !== uid;
                });
                data.set("dates", d);
                ele.closest('table').find('thead tr > th:first-child').html(d.length + "<br> Dates");
                ele.closest('tr').remove();
            }
        },
        getExclusionDates: function () {
            return this.exclusionDatesDataSource.data();
        },
        getIndex: function (e) {
            var id = $(e).data('id');
            var ex = this.exclusionDates;
            var i = ex.length;
            while (i--) {
                if (ex[i].id === id) {
                    return i;
                }
            }
            return -1;
        },
        create: function (e) {
            if (!$('form#frmExclusionDates').valid())
                return;
            var data = $('form#frmExclusionDates').serializeObject();
            data["isFullDay"] = $('input[name="isFullDay"]').is(':checked');
            if (!Boolean(data["isFullDay"])) {
                data["occureFrom"] = moment.tz(data["occureFrom"] + ' ' + data["recurreFrom"], "M/D/YYYY h:mm A", util.getZone()).format();
                data["occureTo"] = moment.tz(data["occureTo"] + ' ' + data["recurreTo"], "M/D/YYYY h:mm A", util.getZone()).format();
                data["recurreTo"] = moment.tz(data["recurreTo"], "LT", util.getZone()).format();
                data["recurreFrom"] = moment.tz(data["recurreFrom"], "LT", util.getZone()).format();
            } else {
                data["occureFrom"] = moment.tz(data["occureFrom"] + " 11:00 AM", "M/D/YYYY h:mm A", util.getZone()).format();
                data["occureTo"] = moment.tz(data["occureTo"] + " 11:00 PM", "M/D/YYYY h:mm A", util.getZone()).format();
                data["recurreFrom"] = moment.tz("11:00 AM", "LT", util.getZone()).format();
                data["recurreTo"] = moment.tz("11:00 PM", "LT", util.getZone()).format();
            }
            var dates = this.generateDates(data["recurrentType"], moment.tz(data["occureFrom"], util.getZone()), moment.tz(data["occureTo"], util.getZone()), data["weekDays"]);
            if (dates.length === 0)
                return;
            var d = [];
            var noOfHours = 0;
            $.each(dates, function (i, v) {
                d.push({
                    date: moment.tz(v, util.getZone()).format(),
                    description: data["description"]
                });
            });
            if (!Boolean(data["isFullDay"])) {
                noOfHours = this.getNoOfHours(data["recurreFrom"], data["recurreTo"]);
            }
            data["dates"] = d;
            this.exclusionDatesDataSource.add(data);
            this.render();
        },
        generateDates: function (type, from, to, weekDays) {
            var option = {};
            var ocType = parseInt(type);
            if (ocType === 1) {
                option = {
                    freq: RRule.DAILY,
                    dtstart: from.toDate(),
                    until: to.toDate()
                };
            } else if (ocType === 2) {
                option = {
                    freq: RRule.WEEKLY,
                    dtstart: from.toDate(),
                    until: to.toDate(),
                    byweekday: this.getWeekRule(weekDays)
                };
            }
            var rule = new RRule(option);
            return rule.all();
        },
        getWeekRule: function (e) {
            var week = [];
            for (var i = 0; i < e.length; i++) {
                switch (parseInt(e[i])) {
                    case 1:
                        week.push(RRule.MO);
                        break;;
                    case 2:
                        week.push(RRule.TU);
                        break;
                    case 3:
                        week.push(RRule.WE);
                        break;
                    case 4:
                        week.push(RRule.TH);
                        break;
                    case 5:
                        week.push(RRule.FR);
                        break;
                    case 6:
                        week.push(RRule.SA);
                        break;
                    case 0:
                        week.push(RRule.SU);
                    default:
                        break;
                }
            }
            return week;
        },
        updateNoOfDates: function (data) {
            switch (parseInt(data["recurrentType"])) {
                case 1:
                    return this.getDailyDates(data);
                case 2:
                    return this.getWeekDates(data);
                default:
                    return 0;
            }
        },
        deleteExclusion: function (e) {
            var _this = this;
            swal({
                title: "Save changes?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: true
            }, function () {
                _this.exclusionDates.splice(_this.getIndex(e.target), 1);
                _this.render();
            });
        },
        toggleTime: function (e) {
            $(e.target).is(':checked') ? $('#fullDayTime').addClass('hidden') : $('#fullDayTime').animateTo('fadeInDown');
        },
        combineDateTime: function (date, time) {
            var timeReg = /(\d+)\:(\d+) (\w+)/;
            var parts = time.match(timeReg);
            if (parts == null) {
                var c = moment.utc(time).format('HH:mm A');
                parts = c.match(timeReg);
            }
            var hours = /am/i.test(parts[3]) ? (function (am) {
                return (am < 12 ? am : 0);
            })(parseInt(parts[1], 10)) : (function (pm) {
                return (pm < 12 ? pm + 12 : 12);
            })(parseInt(parts[1], 10));
            var minutes = parseInt(parts[2], 10);
            var d = new Date(date);
            d.setHours(hours);
            d.setMinutes(minutes);
            return d;
        },
        onRecuurentChange: function (e) {
            if (parseInt($(e.target).val()) !== 2) {
                $('#weekSelection').addClass('hidden');
                $("#ddl-weekdays").data('kendoMultiSelect').value('');
            } else {
                $('#weekSelection').animateTo('fadeInDown');
            }
        }
    };
    var configurationSetup = {
        init: function (e) {
            util.clearStorage('configuration-facility');
            this.configurations = arguments.length === 0 ? util.store('configuration-facility') : util.store('configuration-facility', e);
            this.configSetups = [];
            this.isUpdateMode = false;
            this.configDataSource = new kendo.data.DataSource({
                data: this.configurations,
                schema: {
                    model: {
                        id: "id"
                    }
                }
            });
            this.setupDataSource = new kendo.data.DataSource({
                data: this.configSetups,
                pageSize: 3,
                schema: {
                    model: {
                        id: "configId"
                    }
                }
            });
            this.initGrid();
            this.renderConfig();
        },
        bindWizard: function () {
            $(":file#physicalFiles").kendoUpload({
                async: {
                    saveUrl: "/admin/facility/uploaddoc",
                    autoUpload: true
                },
                multiple: false,
                success: function (e) {
                    var data = e.response;
                    $('#uploadedDocument').val(data);
                }
            });
            $('.number-input').kendoNumericTextBox({
                format: "#",
                min: 1
            });
            $('select[name="objectTypeId"]').on('change', this.onChangeObjectType.bind(this));
            $('#onAddTableSetup').on('click', this.onAddTableSetup.bind(this));
            this.validateSetupConfigForm();
            this.validateSetupTableForm();
            this.wizard = $('#addConfigSetupWindow').wizard({
                keyboard: false,
                contentHeight: 500,
                contentWidth: "65%",
                backdrop: 'static',
                showCancel: true
            });
            $('a#onAddConfigSetup').on('click', this.onClickConfig.bind(this));
            $('select[name="configurationTypeId"]').on('change', this.onConfigurationTypeId.bind(this));
            this.wizard.on('submit', this.onAddConfig.bind(this));
            this.wizard.cards["configuration"].on('validate', this.onValidate.bind(this));
            this.wizard.cards["tablesetup"].on('validate', this.onValidateTableSetup.bind(this));
            this.wizard.el.find(".wizard-success .btn-default").on('click', this.onAddAnother.bind(this));
            this.wizard.el.find(".wizard-success .done-config").on('click', this.finishConfig.bind(this));
            this.initSetupTableGrid();
        },
        getConfigurations: function () {
            return this.configurations;
        },
        getConfigSelectedIndex: function () {
            return this.wizard.cards["configuration"].el.find("select[name='configurationTypeId']").data("kendoDropDownList").selectedIndex;
        },
        onConfigurationTypeId: function (e) {
            var ddl = $('select[name="configurationTypeId"]').data("kendoDropDownList");
            var val = parseInt(ddl.value());
            this.isDefaultAdded() && val === 1 ? $("div#configurationTypeWarning").animateTo("shake") : $("div#configurationTypeWarning").addClass("hidden");
            if (configurationSetup.getConfigSelectedIndex() !== 0) {
                $('span[for="configurationTypeId"]').text("").css({
                    display: "none"
                });
            } else {
                $('span[for="configurationTypeId"]').text("Configuration Type is required!!").removeAttr("style");
            }
            if (val === 1) {
                $('select[name="objectTypeId"]').data("kendoDropDownList").enable(false);
                $('input[name="configurationName"]').val("Default Configuration").prop("readonly", "readonly");
                $('button#onAddTableSetup').prop('disabled', true);
                $('#tblSetupWarning').removeClass('hidden');
            } else {
                $('select[name="objectTypeId"]').data("kendoDropDownList").enable(true);
                var name = $('input[name="configurationName"]');
                name.val(name.val() === "Default Configuration" ? "" : name.val()).prop("readonly", "");
                $('button#onAddTableSetup').prop('disabled', false);
                $('#tblSetupWarning').addClass('hidden');
            }
        },
        renderConfig: function () {
            var _this = this;
            var configs = this.configurations;
            this.configDataSource.data([]);
            $.each(configs, function (i, d) {
                _this.configDataSource.add(d);
            });
            util.store('configuration-facility', configs);
        },
        isDefaultAdded: function () {
            var val = $('select[name="configurationTypeId"]').data('kendoDropDownList').value();
            var configs = this.getConfigurations();
            if (configs.length === 0)
                return false;
            var d = jQuery.grep(configs, function (i, n) {
                return parseInt(i["configurationTypeId"]) === parseInt(val) && parseInt(i["configurationTypeId"]) === 1;
            });
            return d.length !== 0;
        },
        onValidate: function (e) {
            var s = configurationSetup.getConfigSelectedIndex() === 0;
            if (s) {
                $('span[for="configurationTypeId"]').removeAttr("style").text('Configuration Type is required!!');
            }
            return $('form#layoutConfig').valid() && !this.isDefaultAdded() && !s;
        },
        onValidateTableSetup: function (e) {
            var setups = this.setupDataSource.data().toJSON();
            var config = $('form#layoutConfig').serializeObject();
            config["setups"] = setups;
            if (parseInt(config.configurationTypeId) !== 1 && config["setups"].length === 0) {
                $("#tblSetupnoConfig").animateTo("shake");
                setTimeout(function () {
                    $("#tblSetupnoConfig").addClass('hidden');
                }, 5000);
                return false;
            }
        },
        finishConfig: function () {
            var _this = this;
            setTimeout(function () {
                _this.wizard.reset();
            }, 100);
            this.wizard.hide();
        },
        initSetupTableGrid: function () {
            this.setupGrid = $('#facility-setup').kendoGrid({
                dataSource: this.setupDataSource,
                groupable: false,
                selectable: false,
                sortable: false,
                pageable: {
                    refresh: false,
                    pageSizes: false,
                    buttonCount: 0,
                    info: false
                },
                columns: [{
                    field: "objectType",
                    title: "Type"
                }, {
                        field: "noOfTables",
                        title: "No Of Tables"
                    }, {
                        field: "noOfChairsPerTable",
                        title: "No Of Chairs (PerTable)"
                    }, {
                        field: "noOfBlocks",
                        title: "No Of Blocks"
                    }, {
                        field: "noOfRows",
                        title: "No Of Rows"
                    }, {
                        field: "noOfColumns",
                        title: "No Of Columns"
                    }, {
                        command: [{
                            name: "delete",
                            text: "Delete",
                            imageClass: "k-icon k-i-close",
                            className: "btn-xs",
                            click: this.onRemoveSetupConfig.bind(this)
                        }]
                    }]
            });
        },
        onRemoveSetupConfig: function (e) {
            var tr = $(e.target).closest("tr");
            var grid = this.setupGrid.data('kendoGrid');
            var data = grid.dataItem(tr);
            var item = this.setupDataSource.get(data.configId);
            this.setupDataSource.remove(item);
            grid.refresh();
            TsMessage.ShowSuccess("Table configuration setup deleted ");
        },
        onAddConfig: function (e) {
            var _this = this;
            var setups = this.setupDataSource.data().toJSON();
            var config = $('form#layoutConfig').serializeObject();
            config["setups"] = setups;
            if (config['id'] === "")
                config["id"] = util.uuid();
            if (!config.hasOwnProperty('isDefault'))
                config["isDefault"] = false;
            var configType = $('select[name="configurationTypeId"]').data("kendoDropDownList");
            var configCategory = $('select[name="configurationCategoryId"]').data("kendoDropDownList");
            if (parseInt(configType.value()) === 1)
                config.configurationCover = 0;
            config.configurationType = configType.text();
            config.configurationCategory = configCategory.value().trim() === "" ? "" : configCategory.text();
            var local = this.configDataSource.data();
            if (this.isUpdateMode) {
                try {
                    $.each(local, function (i, d) {
                        if (d["id"] === config["id"]) {
                            for (var key in config) {
                                if (config.hasOwnProperty(key)) {
                                    d[key] = config[key];
                                }
                            }
                        }
                    });
                } catch (e) {
                    console.log(e);
                }
                this.configurations = this.configDataSource.data();
            } else {
                this.configurations.push(config);
            }
            this.isUpdateMode = false;
            this.renderConfig();
            this.configGrid.data('kendoGrid').refresh();
            setTimeout(function () {
                _this.resetWizard();
                _this.wizard.trigger("success");
                _this.wizard.hideButtons();
                _this.wizard._submitting = false;
                _this.wizard.showSubmitCard("success");
                _this.wizard.updateProgressBar(0);
            }, 500);
        },
        validateSetupTableForm: function () {
            var objectType = $('select[name="objectTypeId"]');
            $('form#setupTableForm').validate({
                rules: {
                    noOfTables: {
                        required: {
                            depends: function (e) {
                                var val = objectType.val();
                                return $.inArray(parseInt(val), [1, 2, 3]) !== -1;
                            }
                        }
                    },
                    noOfChairsPerTable: {
                        required: {
                            depends: function (e) {
                                var val = objectType.val();
                                return $.inArray(parseInt(val), [1, 2, 3]) !== -1;
                            }
                        }
                    },
                    noOfBlocks: {
                        required: {
                            depends: function (e) {
                                var val = objectType.val();
                                return $.inArray(parseInt(val), [4, 5]) !== -1;
                            }
                        }
                    },
                    noOfRows: {
                        required: {
                            depends: function (e) {
                                var val = objectType.val();
                                return $.inArray(parseInt(val), [4, 5]) !== -1;
                            }
                        }
                    },
                    noOfColumns: {
                        required: {
                            depends: function (e) {
                                var val = objectType.val();
                                return $.inArray(parseInt(val), [4, 5]) !== -1;
                            }
                        }
                    },
                    objectTypeId: {
                        required: true
                    }
                },
                messages: {
                    noOfTables: {
                        required: "no of table required!"
                    },
                    noOfChairsPerTable: {
                        required: "no of chairs per table required!"
                    },
                    noOfBlocks: {
                        required: "no of blocks required!"
                    },
                    noOfRows: {
                        required: "no of rows required!"
                    },
                    noOfColumns: {
                        required: "no of column required!"
                    },
                    objectTypeId: {
                        required: "please select object type"
                    }
                },
                errorElement: 'span',
                errorPlacement: function (error, element) {
                    $(element).closest("form").find("label[for='" + element.attr("id") + "']").append(error);
                }
            });
        },
        validateSetupConfigForm: function () {
            $('form#layoutConfig').validate({
                rules: {
                    configurationName: {
                        required: function (ele) {
                            var selected = $('select[name="configurationTypeId"]').val();
                            return parseInt(selected) > 1 || $(ele).val() === "";
                        }
                    }
                },
                messages: {
                    configurationName: {
                        required: 'configuration name required'
                    },
                }
            });
        },
        resetWizard: function () {
            $('#configurationCover').val(0);
            $('#configurationId').val(0);
            $('#id').val("");
            this.isUpdateMode = false;
            $('form#setupTableForm').trigger('reset');
            $('form#layoutConfig').trigger('reset');
            $('select[name="objectTypeId"]').val(0).trigger('change');
            $("div#configurationTypeWarning").addClass("hidden");
            this.setupDataSource.data([]);
            this.calculateCovers([]);
            this.wizard.reset();
        },
        onChangeObjectType: function (e) {
            var val = $(e.target).val();
            if ($.inArray(parseInt(val), [1, 2, 3]) !== -1) {
                $(".config-cols").not(".c-tables").hide();
                $(".c-tables").show();
            } else if ($.inArray(parseInt(val), [4, 5]) !== -1) {
                $(".config-cols").not(".c-blocks").hide();
                $(".c-blocks").show();
            } else {
                $(".config-cols").hide();
            }
        },
        onClickConfig: function (e) {
            e.preventDefault();
            this.resetWizard();
            this.wizard.show();
        },
        calculateCovers: function (e) {
            $('#configurationCover').val(0);
            var count = 0;
            for (var i in e) {
                if (e.hasOwnProperty(i)) {
                    if (e[i].noOfTables !== "" && typeof e[i].noOfTables !== "undefined") {
                        count += e[i].noOfTables * e[i].noOfChairsPerTable;
                    }
                    if (e[i].noOfBlocks !== "" && typeof e[i].noOfBlocks !== "undefined") {
                        count += e[i].noOfBlocks * e[i].noOfColumns * e[i].noOfRows;
                    }
                }
            }
            $('#capacityCount').text(count).parent().animateTo('bounceIn');
            $('#configurationCover').val(count);
        },
        onAddTableSetup: function (e) {
            if (!$('form#setupTableForm').valid())
                return;
            var data = $('form#setupTableForm').serializeObject();
            if (data.noofblocks === "" && data.noofchairspertable === "" && data.noofcolumns === "" && data.noofrows === "" && data.nooftables === "" && data.objectTypeId === "") {
                TsMessage.ShowError("Please Set Object Type to add Table Setup", function () {
                    return;
                });
                return;
            }
            data["objectType"] = $('select[name="objectTypeId"]').data("kendoDropDownList").text();
            data.configId = util.uuid();
            if (!$('#tblSetupnoConfig').hasClass("hidden")) {
                $("#tblSetupnoConfig").addClass('hidden');
            }
            $('form#setupTableForm').trigger('reset');
            $('select[name="objectTypeId"]').val(0).trigger('change');
            this.setupDataSource.add(data);
            var setups = this.setupDataSource.data();
            this.calculateCovers(setups);
            this.setupGrid.data('kendoGrid').refresh();
            TsMessage.ShowSuccess("Table configuration setup added");
        },
        initGrid: function () {
            this.configGrid = $('#facilityConfigurationGrid').kendoGrid({
                dataSource: this.configDataSource,
                groupable: false,
                selectable: false,
                sortable: true,
                pageable: {
                    refresh: false,
                    pageSizes: false,
                    info: false
                },
                toolbar: [{
                    template: kendo.template($('#addConfigSetupToolTmpl').html())
                }],
                columns: [{
                    field: "configurationName",
                    title: "Name"
                }, {
                        field: "configurationCover",
                        title: "Covers"
                    }, {
                        field: "configurationType",
                        title: "Type"
                    }, {
                        field: "configurationCategory",
                        title: "Category"
                    }, {
                        field: "isDefault",
                        title: "Default Configuration",
                        template: ' <em class="fa fa-lg #: Boolean(isDefault) ? "text-success fa-check-circle" : "text-muted fa-times-circle" #"></em>'
                    }, {
                        command: [{
                            name: "edit",
                            text: "Edit",
                            imageClass: "k-icon k-i-pencil",
                            className: "btn-xs",
                            click: this.onUpdateConfig.bind(this)
                        }, {
                                name: "delete",
                                text: "Delete",
                                imageClass: "k-icon k-i-close",
                                className: "btn-xs",
                                click: this.onRemoveConfig.bind(this)
                            }, {
                                text: "Clone",
                                imageClass: "fa fa-file-o k-reset",
                                className: "btn-xs btn-warning",
                                click: this.onCloneConfig.bind(this)
                            }]
                    }],
                dataBound: function () {
                    var grid = $("#facilityConfigurationGrid").data("kendoGrid");
                    var gridData = grid.dataSource.view();
                    for (var i = 0; i < gridData.length; i++) {
                        var uid = gridData[i].uid;
                        if (Boolean(gridData[i].isExist)) {
                            var currenRow = grid.table.find("tr[data-uid='" + uid + "']");
                            var deleteButton = $(currenRow).find(".k-grid-delete");
                            deleteButton.hide();
                        }
                    }
                }
            });
            this.bindWizard();
        },
        onCloneConfig: function (e) {
            $(e.target).prop("href", "javascript:void(0)");
            var $this = this;
            var tr = $(e.target).closest("tr");
            var grid = this.configGrid.data('kendoGrid');
            var data = grid.dataItem(tr);
            var configId = parseInt(data["configurationId"]);
            if (configId === 0) {
                TsMessage.Show("Newly Added Coonfiguration cannot be cloned without saving facility!!", TsMessage.MessageType.Error);
                return;
            }
            $('#addItemsetupWindow').empty().load('/admin/facility/cloningconfig', function () {
                var _this = this;
                $(this).one('show.bs.modal', function (d) {
                    kendo.destroy($("#facilityMdl"));
                    $("select#facilityId").kendoDropDownList({
                        dataTextField: "facilityName",
                        dataValueField: "facilityId",
                        valueTemplate: '<i class="fa fa-lg fa-check-circle # if(Boolean(data.isActive)) { #  text-success # } else { # text-muted # } #"></i>&nbsp;&nbsp;&nbsp;&nbsp;<strong>#: data.name #</strong>' + '<span class="pull-right">Daily Rate  : <span class="badge  bg-primary-light">#: data.dailyRate#</span>&nbsp;&nbsp;&nbsp;  Hourly Rate : <span class="badge  bg-primary-light"> #:data.hourlyRate#</span>&nbsp;&nbsp;&nbsp;Deposit :   <span class="badge bg-warning-dark"> #:data.reservationDeposit#</span></span>',
                        template: '<i class="fa fa-lg fa-check-circle # if(Boolean(data.isActive)) { #  text-success # } else { # text-muted # } #"></i>&nbsp;&nbsp;&nbsp;&nbsp;<strong>#: data.name #</strong> ' + '<span class="pull-right" style="padding-right:20px;"><i class="fa fa-users" > </i> #: Number(data.standingCapacity) + Number(data.seatingCapacity) #</span>',
                        dataSource: {
                            transport: {
                                read: {
                                    dataType: "json",
                                    url: "/admin/reservation/getfacilitylist",
                                }
                            },
                            schema: {
                                data: "facilities"
                            }
                        },
                        optionLabel: "Select a Facility",
                        height: 800
                    });
                    $('button#btnCloneConfig').on('click', $this.onCloneConfigProceed.bind($this, configId));
                }).one('hidden.bs.modal', function () {
                    $(_this).data('bs.modal', null);
                }).appendTo('body').modal({
                    backdrop: 'static',
                    keyboard: true
                });
            });
        },
        onCloneConfigProceed: function (configId, e) {
            var clone = $('form#frmSelectFacility').serializeObject();
            if (clone["facilityId"] === "" || clone["configName"] === "") {
                TsMessage.Show("Please Complete All the fields to proceed with cloning", TsMessage.MessageType.Error);
                return;
            }
            $.ajax({
                url: '/admin/facility/cloneconfiguration',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: {
                    facilityId: clone["facilityId"],
                    configId: configId,
                    name: clone["configName"]
                },
                method: "GET",
                success: function (data) {
                    TsMessage.Show(data.status, TsMessage.MessageType.Success);
                    if (clone["facilityId"] === $.QueryString["id"])
                        swal({
                            title: "Do you want to reload the page?",
                            text: "Any unsaved changes will be discarded",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Yes, reload it!",
                            closeOnConfirm: true
                        }, function () {
                            location.reload(true);
                        });
                    else {
                        $('#addItemsetupWindow').modal('hide');
                    }
                }
            });
        },
        onUpdateConfig: function (e) {
            var _this = this;
            $(e.target).prop("href", "javascript:void(0)");
            var tr = $(e.target).closest("tr");
            var grid = this.configGrid.data('kendoGrid');
            var data = grid.dataItem(tr);
            this.updateFormEditMode(data);
            this.setupDataSource.data([]);
            $.each(data.setups, function (i, d) {
                d["configId"] = util.uuid();
                _this.setupDataSource.add(d);
            });
            this.calculateCovers(data.setups);
            this.setupGrid.data('kendoGrid').refresh();
            this.isUpdateMode = true;
            this.validateSetupConfigForm();
            this.validateSetupTableForm();
            this.wizard.show();
        },
        onRemoveConfig: function (e) {
            var _this = this;
            $(e.target).prop("href", "javascript:void(0)");
            var tr = $(e.target).closest("tr");
            var grid = this.configGrid.data('kendoGrid');
            var data = grid.dataItem(tr);
            var configs = this.configurations;
            swal({
                title: "Delete this configuration?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: true
            }, function () {
                _this.configDataSource.remove(data);
                grid.refresh();
                _this.configurations = $.grep(configs, function (n, i) {
                    return n["id"] !== data.id;
                });
                _this.renderConfig();
            });
        },
        updateFormEditMode: function (e) {
            if (e == null)
                return;
            for (var i in e) {
                if (!e.hasOwnProperty(i))
                    return;
                $('form#layoutConfig');
                var tag = $('form#layoutConfig input[name="' + i.toCamelCase() + '"]');
                if (typeof tag.prop('tagName') === 'undefined') {
                    tag = $('form#layoutConfig select[name="' + i.toCamelCase() + '"]');
                    if (typeof tag.prop('tagName') === 'undefined')
                        continue;
                    else {
                        var select = tag.data("kendoDropDownList");
                        select.select(function (val) {
                            return val.value == e[i];
                        });
                    }
                } else {
                    var name = tag.prop('tagName').toLowerCase();
                    switch (name) {
                        case 'input':
                            if (tag.is(':checkbox')) {
                                tag.prop('checked', e[i]);
                            } else if (tag.is(':text')) {
                                if (tag.is('input.k-input')) {
                                    if (typeof tag.data("kendoNumericTextBox") !== "undefined")
                                        tag.data("kendoNumericTextBox").value(e[i]);
                                    else if (typeof tag.data("kendoTimePicker") !== "undefined") {
                                        var picker = tag.data("kendoTimePicker");
                                        picker.value(moment.utc(e[i]).format('h:mm A'));
                                    } else if (typeof tag.data() !== 'undefined') {
                                        var dp = tag.data("kendoDatePicker");
                                        dp.value(moment.utc(e[i]).format());
                                    }
                                } else if (tag.is('input.k-textbox')) {
                                    tag.data("kendoMaskedTextBox").value(e[i]);
                                } else {
                                    tag.val(e[i]);
                                }
                            } else if (tag.is(':hidden')) {
                                tag.val(e[i]);
                            }
                            break;
                        case 'textarea':
                            var editor = tag.data("kendoEditor");
                            editor.value(e[i]);
                            break;
                        default:
                            break;
                    }
                }
            }
        },
        onAddAnother: function () {
            this.resetWizard();
        },
    };
    var notifyReaders = {
        init: function (e) {
            var _this = this;
            util.clearStorage('notify-facility');
            this.selectedReaderType = 1;
            this.selectedReader = null;
            this.readers = arguments.length === 0 ? util.store('notify-facility') : util.store('notify-facility', e);
            this.notifyDataSource = new kendo.data.DataSource({
                data: this.readers,
                pageSize: 5,
                schema: {
                    model: {
                        id: "id"
                    }
                }
            });
            this.readersDataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "getcustomers",
                        data: function () {
                            return {
                                customerType: _this.selectedReaderType
                            };
                        }
                    }
                },
                schema: {
                    data: "readers",
                    model: {
                        id: "id"
                    }
                }
            });
            this.bindEvents();
            this.initGrid();
            this.render();
        },
        bindEvents: function () {
            this.readerInput = $("#notifyUser").kendoAutoComplete({
                dataSource: this.readersDataSource,
                filter: "contains",
                dataTextField: "recipientName",
                placeholder: "Select Customer...",
                template: '<b>#: data.recipientName #</b><br><small>#: (data.recipientEmail == "" || data.recipientEmail == null) ? "" : data.recipientEmail#</small>',
                select: this.onSelectReader.bind(this)
            });
            $('input[name="readerType"]').on('change', this.onReaderTypeChange.bind(this));
            $('a#cancelToReaderList').on('click', this.onCancelReader.bind(this));
            $('a#addToReaderList').on('click', this.onAddReader.bind(this));
        },
        onAddReader: function (e) {
            if (!this.readerFormValid())
                return;
            var reader = this.selectedReader;
            if (reader !== null) {
                reader["id"] = util.uuid();
                reader["recipientEmail"] = $('#recipientEmail').val();
                reader["deleted"] = false;
            }
            var type = parseInt($('input[name="readerType"]:checked').val());
            if (type === 3 && reader == null)
                this.readers.push({
                    recipientName: $('#notifyUser').val(),
                    recipientEmail: $('#recipientEmail').val(),
                    id: util.uuid(),
                    deleted: false
                });
            else {
                this.readers.push(this.selectedReader);
            }
            this.render();
            this.onReset();
        },
        readerFormValid: function () {
            var name = $('#notifyUser'),
                email = $('#recipientEmail');
            var mailRegex = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
            if (name.val().trim() === '') {
                TsMessage.Show("Recipient Name Required", TsMessage.MessageType.Error);
                return false;
            } else if (email.val().trim() === '') {
                TsMessage.Show("Recipient Email Required", TsMessage.MessageType.Error);
                return false;
            } else if (!mailRegex.test(email.val().trim())) {
                TsMessage.Show("Invalid Email", TsMessage.MessageType.Error);
                return false;
            } else {
                return true;
            }
        },
        onSelectReader: function (e) {
            $('#readerAdd').animateTo('fadeInTop');
            var item = this.readerInput.data('kendoAutoComplete').dataItem(e.item.index());
            this.selectedReader = item;
            $('#recipientEmail').val(item.recipientEmail);
            $('#notifyUser').prop('readonly', 'readonly');
        },
        onReset: function () {
            $('#recipientEmail').val('');
            $('#notifyUser').prop('readonly', '');
            this.readerInput.data('kendoAutoComplete').value('');
            this.selectedReader = null;
            var type = parseInt($('input[name="readerType"]:checked').val());
            if (type !== 3)
                $('#readerAdd').addClass('hidden');
        },
        onCancelReader: function (e) {
            this.onReset();
            var type = parseInt($('input[name="readerType"]:checked').val());
            if (type === 3)
                $('#readerAdd').animateTo('fadeInTop');
        },
        onReaderTypeChange: function (e) {
            this.onReset();
            this.selectedReaderType = parseInt($(e.target).val());
            var complete = this.readerInput.data('kendoAutoComplete');
            if (this.selectedReaderType !== 3) {
                complete.unbind("open");
                complete.options.suggest = true;
                $('#notifyUser').prop('placeholder', 'Select Customer...');
                this.readersDataSource.read();
            } else {
                complete.options.suggest = false;
                complete.bind("open", function (ex) {
                    ex.preventDefault();
                });
                $('#notifyUser').prop('placeholder', 'Enter Name');
                $('#readerAdd').animateTo('fadeInTop');
            }
        },
        getReaders: function () {
            return this.readers;
        },
        setReaders: function (e) {
            this.readers = e;
        },
        render: function () {
            var _this = this;
            var readers = this.readers;
            this.notifyDataSource.data([]);
            $.each(readers, function (i, d) {
                if (Boolean(d["deleted"]) === false) {
                    _this.notifyDataSource.add(d);
                }
            });
            this.notifyGrid.data('kendoGrid').refresh();
            util.store('notify-facility', readers);
        },
        initGrid: function () {
            this.notifyGrid = $('#notificationReaderGrid').kendoGrid({
                dataSource: this.notifyDataSource,
                groupable: true,
                selectable: false,
                sortable: false,
                pageable: {
                    refresh: false,
                    pageSizes: false,
                    buttonCount: 0,
                    info: false
                },
                scrollable: false,
                columns: [{
                    field: "recipientName",
                    title: "Recipient Name"
                }, {
                        field: "recipientEmail",
                        title: "Recipient Email"
                    }, {
                        command: [{
                            name: "delete",
                            text: "Delete",
                            imageClass: "k-icon k-i-close",
                            className: "btn-xs",
                            click: this.onRemoveNotifyReader.bind(this)
                        }]
                    }]
            });
        },
        onRemoveNotifyReader: function (e) {
            var _this = this;
            swal({
                title: "Delete this record?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: true
            }, function () {
                var tr = $(e.target).closest('tr');
                var grid = _this.notifyGrid.data('kendoGrid');
                var data = grid.dataItem(tr);
                var readers = _this.getReaders();
                $.each(readers, function (n, d) {
                    if (d["id"] === data.id)
                        d["deleted"] = true;
                });
                _this.setReaders(readers);
                _this.render();
                $('html, body').animate({
                    scrollTop: _this.notifyGrid.offset().top - 100
                }, 500);
            });
        },
    };
    $(function () {
        var componentForm = {
            street_number: "short_name",
            route: "long_name",
            locality: "long_name",
            administrative_area_level_1: "short_name",
            country: "long_name",
            postal_code: "short_name"
        };
        var mapping = {
            street_number: "number",
            route: "street",
            locality: "city",
            administrative_area_level_1: "state",
            country: "countryId",
            postal_code: "postCode"
        };
        var extraItems = [];
        var itemDataSource = new kendo.data.DataSource({
            data: extraItems,
            transport: {
                read: function (e) {
                    e.success(extraItems);
                }
            },
            error: function (e) {
                alert("Status: " + e.status + "; Error message: " + e.errorThrown);
            }
        });
        var addNewFacility = function () {
            if (!$('form#setupConfig').valid())
                return;
            var form = $('form#setupConfig').serializeObject();
            var layout = util.store('configuration-facility');
            var exclusions = exclusionDate.getExclusionDates();
            var item = itemDataSource.data();
            var terms = util.store('terms-facility');
            var notify = util.store('notify-facility');
            swal({
                title: "Save facility?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#27c24c",
                confirmButtonText: "Yes Proceed!",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function () {
                util.saveForm(form, layout, exclusions, item, terms, notify);
            });
        };
        var updateFacility = function (e) {
            if (!$('form#setupConfig').valid())
                return;
            var form = $('form#setupConfig');
            var facilityId = $("<input>").attr("type", "hidden").attr("name", "facilityId").val(e.data.facilityId);
            form.append(facilityId);
            var formValue = form.serializeObject();
            var layout = util.store('configuration-facility');
            var exclusions = exclusionDate.getExclusionDates();
            if (exclusions.length > 0) {
                $.each(exclusions, function (i, d) {
                    d["occureFrom"] = moment.tz(d["occureFrom"], util.getZone()).format("MM/DD/YYYY");
                    d["occureTo"] = moment.tz(d["occureTo"], util.getZone()).format("MM/DD/YYYY");
                    d["recurreFrom"] = moment.tz(d["recurreFrom"], util.getZone()).format("LT");
                    d["recurreTo"] = moment.tz(d["recurreTo"], util.getZone()).format("LT");
                });
            }
            var items = itemDataSource.data();
            var terms = util.store('terms-facility');
            var notify = util.store('notify-facility');
            swal({
                title: "Save changes?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#27c24c",
                confirmButtonText: "Yes Proceed!",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function () {
                util.updateForm(formValue, layout, exclusions, items, terms, notify);
                return;
            });
        };
        var itemGrid;
        var initItemUpdateMode = function (e) {
            $.each(e, function (i, v) {
                v.availableFrom = moment.utc(v.availableFrom).toDate().format("mm/dd/yyyy");
                v.availableTo = moment.utc(v.availableTo).toDate().format("mm/dd/yyyy");
                itemDataSource.add(v);
            });
            var grid = itemGrid.data('kendoGrid');
            grid.refresh();
        };
        var onAddItemSetup = function () {
            if (!$('form#setupItemForm').valid())
                return;
            var data = $('form#setupItemForm').serializeObject();
            data["id"] = Math.floor(Math.random() * (1000 - 0 + 1)) + 0;
            data["itemRef"] = "";
            data["facilityId"] = $.QueryString["id"];
            data["itemId"] = 0;
            data["priceType"] = $('#priceTypeId').data('kendoDropDownList').text();
            data["isActive"] = $('#setupItemForm input[name="isActive"]').is(':checked');
            data["isExist"] = false;
            itemDataSource.add(data);
            var grid = itemGrid.data('kendoGrid');
            grid.refresh();
            $('#addItemsetupWindow').modal('hide');
        };
        var onUpdateItemSetup = function () {
            if (!$('form#setupItemForm').valid())
                return;
            var data = $('form#setupItemForm').serializeObject();
            data["priceType"] = $('#priceTypeId').data('kendoDropDownList').text();
            data["isActive"] = $('#setupItemForm input[name="isActive"]').is(':checked');
            var item = itemDataSource.get(data.id);
            $.each(data, function (key, val) {
                item.set(key, val);
            });
            var grid = itemGrid.data('kendoGrid');
            grid.refresh();
            $('#addItemsetupWindow').modal('hide');
        };
        var initItemLocalEditMode = function (e) {
            if (e == null)
                return;
            for (var i in e) {
                if (!e.hasOwnProperty(i))
                    return;
                var tag = $('#setupItemForm input[name="' + i.toCamelCase() + '"]');
                if (typeof tag.prop('tagName') === 'undefined') {
                    tag = $('#setupItemForm select[name="' + i.toCamelCase() + '"]');
                    if (typeof tag.prop('tagName') === 'undefined')
                        continue;
                    else {
                        var select = tag.data("kendoDropDownList");
                        select.select(function (val) {
                            return val.value == e[i];
                        });
                    }
                } else {
                    var name = tag.prop('tagName').toLowerCase();
                    switch (name) {
                        case 'input':
                            if (tag.is(':checkbox')) {
                                tag.prop('checked', e[i]);
                            } else if (tag.is(':text')) {
                                if (tag.is('input.k-input')) {
                                    if (typeof tag.data("kendoNumericTextBox") !== "undefined")
                                        tag.data("kendoNumericTextBox").value(e[i]);
                                    else if (typeof tag.data("kendoTimePicker") !== "undefined") {
                                        var picker = tag.data("kendoTimePicker");
                                        picker.value(moment.tz(e[i], util.getZone()).format('h:mm A'));
                                    } else if (typeof tag.data() !== 'undefined') {
                                        var dp = tag.data("kendoDatePicker");
                                        dp.value(moment.tz(e[i], util.getZone()).format());
                                    }
                                } else if (tag.is('input.k-textbox')) {
                                    tag.data("kendoMaskedTextBox").value(e[i]);
                                } else {
                                    tag.val(e[i]);
                                }
                            } else if (tag.is(':hidden')) {
                                tag.val(e[i]);
                            }
                            break;
                        case 'textarea':
                            var editor = tag.data("kendoEditor");
                            editor.value(e[i]);
                            break;
                        default:
                            break;
                    }
                }
            }
        };
        $('form#setupConfig').validate({
            rules: {
                name: {
                    required: true
                },
                reservationDeposit: {
                    required: true,
                },
                url: {
                    urlWithoutHttp: true
                },
                email: {
                    email: true
                },
                phoneNumber: {
                    phoneUS: true
                },
                mobileNumber: {
                    phoneUS: true
                },
                facilityManagerId: {
                    required: true
                },
                venueId: {
                    required: true
                },
                dailyRate: {
                    required: true
                },
                hourlyRate: {
                    required: true
                }
            },
            messages: {
                name: {
                    required: '* Please enter name'
                },
                reservationDeposit: {
                    required: '* Please enter deposite',
                },
                email: {
                    email: '* Please enter valid email'
                },
                phoneNumber: {
                    phoneUS: '* Please enter valid number'
                },
                mobileNumber: {
                    phoneUS: '* Please enter valid number'
                },
                facilityManagerId: {
                    required: "* Please select facility manager"
                },
                venueId: {
                    required: "* Please select venue"
                },
                dailyRate: {
                    required: '* Please enter daily rate'
                },
                hourlyRate: {
                    required: '* Please enter hourly rate'
                }
            },
            errorElement: 'span',
            errorPlacement: function (error, element) {
                if (element)
                    $(element).closest("form").find("label[for='" + element.attr("id") + "']").append(error);
            }
        });
        var validateItemSetup = function () {
            $('form#setupItemForm').validate({
                rules: {
                    itemName: {
                        required: true
                    },
                    quantityPerDay: {
                        required: true
                    },
                    priceTypeId: {
                        required: true
                    },
                    price: {
                        required: true
                    },
                    availableFrom: {
                        required: true
                    },
                    availableTo: {
                        required: true
                    },
                },
                messages: {
                    itemName: {
                        required: '* Please enter name'
                    },
                    quantityPerDay: {
                        required: '* Quantity required',
                    },
                    priceTypeId: {
                        required: '* Price type required'
                    },
                    price: {
                        required: '* Price required'
                    },
                    availableFrom: {
                        required: '* From date required'
                    },
                    availableTo: {
                        required: "* To date required"
                    }
                },
                errorElement: 'span',
                errorPlacement: function (error, element) {
                    if (element)
                        $(element).closest("form").find("label[for='" + element.attr("id") + "']").append(error);
                }
            });
        };
        var initLookups = function () {
            kendo.ui.progress($("#setup"), true);
            $(".ui-text-area").kendoEditor({
                resizable: {
                    content: true,
                    toolbar: true
                }
            });
            $('input[name="reservationDeposit"]').kendoNumericTextBox({
                format: "c2",
                min: 0
            });
            $('input[name="dailyRate"]').kendoNumericTextBox({
                format: "c2",
                min: 0
            });
            $('input[name="hourlyRate"]').kendoNumericTextBox({
                format: "c2",
                min: 0
            });
            $('input[name="standingCapacity"]').kendoNumericTextBox({
                format: "#",
                min: 0
            });
            $('input[name="seatingCapacity"]').kendoNumericTextBox({
                format: "#",
                min: 0
            });
            $('input[name="length"]').kendoNumericTextBox({
                format: "n",
                min: 0
            });
            $('input[name="height"]').kendoNumericTextBox({
                format: "n",
                min: 0
            });
            $('input[name="width"]').kendoNumericTextBox({
                format: "n",
                min: 0
            });
            $('input[name="bumpInMinutes"]').kendoNumericTextBox({
                format: "n",
                min: 0,
                value: 0
            });
            $('input[name="bumpOutMinutes"]').kendoNumericTextBox({
                format: "n",
                min: 0,
                value: 0
            });
            $('input[name="phoneNumber"]').kendoMaskedTextBox({
                mask: "(999) 000-0000"
            });
            $('input[name="mobileNumber"]').kendoMaskedTextBox({
                mask: "(999) 000-0000"
            });
            $('#operatingStartTime').kendoTimePicker({
                value: new Date(2011, 0, 1, 09, 0)
            });
            $('#operatingEndTime').kendoTimePicker({
                value: new Date(2011, 0, 1, 17, 0)
            });
            $('input[name="recurreFrom"]').kendoTimePicker();
            $('input[name="recurreTo"]').kendoTimePicker();
            $('input[name="occureFrom"]').kendoDatePicker();
            $('input[name="occureTo"]').kendoDatePicker();
            $('input[name="colorCode"]').kendoColorPicker();
            itemGrid = $('#extraItemGrid').kendoGrid({
                dataSource: itemDataSource,
                selectable: false,
                sortable: true,
                pageable: {
                    refresh: false,
                    pageSizes: false,
                    info: false
                },
                toolbar: [{
                    template: kendo.template($('#addItemSetupToolTmpl').html())
                }],
                columns: [{
                    field: "itemRef",
                    title: "Item Ref"
                }, {
                        field: "itemName",
                        title: "Item Name"
                    }, {
                        field: "quantityPerDay",
                        title: "Quantity Per Day"
                    }, {
                        field: "priceType",
                        title: "Price Type"
                    }, {
                        field: "price",
                        title: "Price"
                    }, {
                        field: "availableFrom",
                        title: "Available From"
                    }, {
                        field: "availableTo",
                        title: "Available To"
                    }, {
                        command: [{
                            name: "edit",
                            text: "Edit",
                            imageClass: "k-icon k-i-pencil",
                            className: "btn-xs",
                            click: function (e) {
                                $(e.target).prop("href", "javascript:void(0)");
                                var tr = $(e.target).closest("tr");
                                var data = this.dataItem(tr);
                                $('#addItemsetupWindow').load('additem', function () {
                                    $(this).one('show.bs.modal', function (d) {
                                        $('#quantityPerDay').kendoNumericTextBox({
                                            format: "#",
                                            min: 0
                                        });
                                        $('#price').kendoNumericTextBox({
                                            format: "c",
                                            decimals: 3,
                                            min: 0
                                        });
                                        $('#availableFrom').kendoDatePicker();
                                        $('#availableTo').kendoDatePicker();
                                        $('#priceTypeId').kendoDropDownList();
                                        data.itemRef !== '' ? $('#lblItemRef').text(data.itemRef) : $('#lblItemRef').text("000000000000000");
                                        initItemLocalEditMode(data);
                                        validateItemSetup();
                                        $('button#onAddItemSetup').on('click', onUpdateItemSetup);
                                    }).one('hidden.bs.modal', function () {
                                        $('#addItemsetupWindow').empty();
                                    }).appendTo('body').modal({
                                        backdrop: 'static',
                                        keyboard: true
                                    });
                                });
                            }
                        }, {
                                name: "delete",
                                text: "Delete",
                                imageClass: "k-icon k-i-close",
                                className: "btn-xs",
                                click: function (e) {
                                    $(e.target).prop("href", "javascript:void(0)");
                                    var tr = $(e.target).closest("tr");
                                    var data = this.dataItem(tr);
                                    swal({
                                        title: "Delete this item?",
                                        type: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#DD6B55",
                                        confirmButtonText: "Yes, delete it!",
                                        closeOnConfirm: true
                                    }, function () {
                                        var item = itemDataSource.get(data.id);
                                        itemDataSource.remove(item);
                                    });
                                }
                            }]
                    }],
                dataBound: function () {
                    var grid = $("#extraItemGrid").data("kendoGrid");
                    var gridData = grid.dataSource.view();
                    for (var i = 0; i < gridData.length; i++) {
                        var uid = gridData[i].uid;
                        if (Boolean(gridData[i].isExist)) {
                            var currenRow = grid.table.find("tr[data-uid='" + uid + "']");
                            var deleteButton = $(currenRow).find(".k-grid-delete");
                            deleteButton.hide();
                        }
                    }
                }
            });
            itemGrid.find('a#onAddItemSetup').on('click', function () {
                $('#addItemsetupWindow').load('additem', function () {
                    $(this).one('show.bs.modal', function (d) {
                        $('#quantityPerDay').kendoNumericTextBox({
                            format: "#",
                            min: 0
                        });
                        $('#price').kendoNumericTextBox({
                            format: "c",
                            decimals: 3,
                            min: 0
                        });
                        $('#availableFrom').kendoDatePicker();
                        $('#availableTo').kendoDatePicker();
                        $('#priceTypeId').kendoDropDownList();
                        validateItemSetup();
                        $('button#onAddItemSetup').on('click', onAddItemSetup);
                    }).appendTo('body').modal({
                        backdrop: 'static',
                        keyboard: true
                    });
                });
            });
            $.ajax({
                url: '/admin/facility/getlookup',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                method: "GET",
                success: function (data) {
                    $('select[name="facilityManagerId"]').kendoDropDownList({
                        dataSource: data.lookups.facilityManagers,
                        dataTextField: "text",
                        dataValueField: "value",
                        optionLabel: {
                            text: "Select Facility Manager"
                        }
                    });
                    $('select[name="facilityCategoryId"]').kendoDropDownList({
                        dataSource: data.lookups.facilityCategories,
                        dataTextField: "text",
                        dataValueField: "value",
                        optionLabel: {
                            text: "Select Facility Category"
                        }
                    });
                    $('select[name="venueId"]').kendoDropDownList({
                        dataSource: data.lookups.facilityVeneus,
                        dataTextField: "text",
                        change: validateName,
                        dataValueField: "value",
                        optionLabel: {
                            text: "Select Venue"
                        }
                    });
                    $('select[name="facilityTypeId"]').kendoDropDownList({
                        dataSource: data.lookups.facilityTypes,
                        dataTextField: "text",
                        dataValueField: "value",
                        optionLabel: {
                            text: "Select Facility Type"
                        }
                    });
                    $('select[name="configurationTypeId"]').kendoDropDownList({
                        dataSource: data.lookups.configType,
                        dataTextField: "text",
                        dataValueField: "value",
                        optionLabel: {
                            text: "Select Configuration Type"
                        }
                    });
                    $('select[name="configurationCategoryId"]').kendoDropDownList({
                        dataSource: data.lookups.configCategory,
                        dataTextField: "text",
                        dataValueField: "value",
                        optionLabel: {
                            text: "Select Configuration Category",
                            value: 0
                        }
                    });
                    $('select[name="objectTypeId"]').kendoDropDownList({
                        dataSource: data.lookups.configObjectType,
                        dataTextField: "text",
                        dataValueField: "value",
                        optionLabel: {
                            text: "Select Object Type"
                        }
                    });
                    $('select[name="metricUnitId"]').kendoDropDownList({
                        dataSource: data.lookups.metrics,
                        dataTextField: "text",
                        dataValueField: "value",
                        optionLabel: {
                            text: "Select Metric Type"
                        }
                    });
                }
            });
            var facilityId = $.QueryString["id"];
            typeof facilityId === 'undefined' ? $('button[data-role="msave"]').bind('click', addNewFacility) : $('button[data-role="msave"]').bind('click', {
                facilityId: facilityId
            }, updateFacility);
            if (typeof facilityId !== 'undefined') {
                $.ajax({
                    url: '/admin/facility/editfacility',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: {
                        id: facilityId
                    },
                    method: "GET",
                    success: function (data) {
                        setTimeout(function () {
                            util.initSetupUpdateMode(data.facility);
                            data.config.length > 0 ? configurationSetup.init(data.config) : configurationSetup.init();
                            data.exclusions.length > 0 ? exclusionDate.init(data.exclusions) : exclusionDate.init();
                            data.readers.length > 0 ? notifyReaders.init(data.readers) : notifyReaders.init();
                            initItemUpdateMode(data.items);
                            data.terms.length > 0 ? dynamicTerms.init(data.terms) : dynamicTerms.init();
                            $('input[name="hashTag"]').tagsinput({
                                trimValue: true,
                                allowDuplicates: false,
                                onTagExists: function (item, $tag) {
                                    $tag.hide().fadeIn();
                                }
                            });
                            kendo.ui.progress($("#setup"), false);
                        }, 1000);
                    }
                });
            } else {
                $('input[name="hashTag"]').tagsinput({
                    trimValue: true,
                    allowDuplicates: false,
                    onTagExists: function (item, $tag) {
                        $tag.hide().fadeIn();
                    }
                });
                dynamicTerms.init();
                exclusionDate.init();
                configurationSetup.init();
                notifyReaders.init();
                kendo.ui.progress($("#setup"), false);
            }
        };
        initLookups();
        google.maps.event.addDomListener(window, 'load', function () {
            var places = new google.maps.places.Autocomplete($('#location')[0]);
            google.maps.event.addListener(places, 'place_changed', function () {
                var place = places.getPlace();
                for (var i = 0; i < place.address_components.length; i++) {
                    var addressType = place.address_components[i].types[0];
                    if (componentForm[addressType]) {
                        var val = place.address_components[i][componentForm[addressType]];
                        $('[name=' + mapping[addressType] + ']').val(val);
                    }
                }
                var lat = place.geometry.location.lat();
                var lng = place.geometry.location.lng();
                util.googleMapInitialize(lat, lng);
                $('#latitude').val(lat.toString());
                $('#longitude').val(lng.toString());
                $('input[name=address1]').val(place.name);
                $('input[name=address2]').val(place.formatted_address);
                $('.address-set').hide();
                $('#location2').show();
            });
        });
        $('input[name="hashTag"]').on('beforeItemAdd', function (e) {
            if (e.item.replace(/[^\w ]/g, "").split(/\s+/).length > 1)
                e.cancel = true;
        });
        $('button[data-role="mcolse"]').on('click', function (e) {
            swal({
                title: "Do you want to go back?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes",
                closeOnConfirm: false
            }, function () {
                $(location).attr('href', '/admin/facility/details');
            });
        });
        $('a.alert-link').on('click', function () {
            $('.address-set').find('input:text').val('');
            $('.address-set').hide();
            $('.location-map').css("background-color", 'rgb(217, 246, 255)').empty();
            $('#location' + $(this).data('target')).show();
        });
        var validateName = function (e) {
            var facilityId = $.QueryString["id"];
            if (facilityId)
                return;
            var venue = $('select[name="venueId"]').data("kendoDropDownList").value();
            var name = $('input[name="name"]').val();
            if (venue === "" || name === "")
                return;
            $.ajax({
                url: '/admin/facility/validatename',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: {
                    venueId: venue,
                    name: name
                },
                method: "GET",
                success: function (data) {
                    if (!Boolean(data.valid)) {
                        TsMessage.Show("Facility Already Exist On The System", TsMessage.MessageType.Error);
                        setTimeout(function () {
                            $('input[name="name"]').val('');
                        }, 1000);
                    }
                }
            });
        };
        $('input[name="name"]').on('blur', validateName);
    });
    $(window).load(function () {
        $("#setup").removeClass('hidden').animateTo('fadeInDown');
    });
})(FacilitySetup || (FacilitySetup = {}));