if (!pageUnload) {
    var pageUnload;
}
oldPageUnload = pageUnload
pageUnload = function () {
    try {
        app.pageUnload();
    } catch (ex) {
    }
    if (oldPageUnload && oldPageUnload != pageUnload)
        oldPageUnload.apply(arguments);
    pageUnload = oldPageUnload;
}

if (window['app'] == undefined) app = {};
app.veeva = {
    iRepActive: true,
    initialized: false,
    username: '',
    ensureInitialized: function () {
        if (!this.initialized) {
            this.initialized = true;
            var data = this.getObject({ Account: { FirstName: "" }, User: { Username: ''} });
            var accountInfo = data.Account;
            this.iRepActive = !(accountInfo.FirstName == undefined || accountInfo.FirstName == null);
            var userInfo = data.User;
            this.username = (userInfo.Username == undefined || userInfo.Username == null) ? null : userInfo.Username;
        }
    },
    saveObject: function (objectName, value, callback) {
        this.ensureInitialized();
        callback = callback || function () { };
        if (!this.iRepActive) {
            callback({ error: 'iRep is not active' });
            return;
        }
        this.callbackIndex = this.callbackIndex || 0;
        this.callbackIndex++;
        var callbackName = "objectSavedCallback_" + this.callbackIndex;
        window[callbackName] = callback;
        if (!(typeof value == 'string' || value instanceof String))
            value = JSON.stringify(value);
        document.location = "veeva:saveObject(" + objectName + "),value(" + value + "),callback(" + callbackName + ")";
    },
    getObject: function (object) {
        this.ensureInitialized();
        if (!this.iRepActive) return;
        function callVeeva() {
            var uniqueId = 0;
            var global = window;
            var destroy = (function () {
                var trash = document.createElement('div');
                return function (element) {
                    trash.appendChild(element);
                    trash.innerHTML = '';
                };
            })();

            return function (url) {
                var head = document.body;
                var tag = document.createElement('iframe'),
				handler = 'veevajscallback' + uniqueId++,
				url = url.replace('iRepCallback(result)', handler + '(result)');
                var data2 = null;
                global[handler] = function (data) {
                    data2 = data;
                };
                tag.style.position = "absolute";
                tag.style.width = "1px";
                tag.style.height = "1px";
                tag.src = url;
                head.insertBefore(tag, head.firstChild);
                destroy(tag);
                delete global[handler];
                return data2;
            }
        }
        var veevaCall = callVeeva();
        for (var objectName in object) {
            for (var fieldName in object[objectName]) {
                var response = veevaCall("veeva:getDataForObject(" + objectName + "),fieldname(" + fieldName + "),iRepCallback(result)");
                response = response ? response[objectName][fieldName] : null;
                if ((response || "").toLowerCase() == (objectName + "." + fieldName).toLowerCase())
                    response = "";
                object[objectName][fieldName] = response;
            }
        }
        return object;
    },
    environment: function () {
        this.ensureInitialized();
        if (!this.iRepActive) return null;
        var username = app.veeva.username || "";
        function endsWith(str, stringToSearch) {
            str = (str || '').toLowerCase();
            stringToSearch = (stringToSearch || '').toLowerCase();
            return (str.length - str.lastIndexOf(stringToSearch)) == stringToSearch.length;
        }
        function contains(str, stringToSearch) {
            str = (str || '').toLowerCase();
            stringToSearch = (stringToSearch || '').toLowerCase();
            return str.indexOf(stringToSearch) > 0
        }
        return contains(username, '@pdi') ? 'pdi' : contains(username, '.clmfactory') ? 'bt' : null;
    },
    gotoSlide: function (slide) {
        //pageUnload();
        //document.location = "../" + slide + "/" + slide + ".html"; // "veeva:gotoSlide(" + slide + ".zip)";
        document.location = "veeva:gotoSlide(" + slide + ".zip)";
    },
    gotoPISlide: function () {
        location = "pdf/PI.pdf";
    },
    gotoMedicationSlide: function () {
        location = "pdf/Medication.pdf";
    },
    gotoNPSClickableSlide: function () {
        location = "pdf/VCP669508_NPS Clickable PDF_updated.pdf";
    },
    isPdiEnvironment: function () {
        return this.environment() == 'pdi';
    }
}

app.tracking = {
    saveClickstreamObject: function (value, callback) {
        app.veeva.saveObject("Call_Clickstream_vod__c", value, callback);
    },
    trackSlideVisit: function (callback) {
        var slide = app.slides.currentSlide;
        switch (app.veeva.environment()) {
            case 'pdi':
                var assetId = [slide.guid, slide.internalName, slide.version, slide.externalName].join('::');
                this.saveClickstreamObject({ Survey_Type_vod__c: 'Tab', Question_vod__c: assetId, Answer_vod__c: "Visited" }, function (result) {
                    callback && callback(result);
                });
                break;
            default:
                this.saveClickstreamObject({ Track_Element_Id_vod__c: app.slides.currentSlide.guid, Track_Element_Description_vod__c: app.slides.currentSlide.isChild ? "ChildSlide" : "ParentSlide", Popup_Opened_vod__c: !!app.slides.currentSlide.isChild, Usage_Start_Time_vod__c: (new Date()).toISOString() }, callback);
        }
    }
}

veeva = app.veeva;